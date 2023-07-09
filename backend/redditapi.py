import requests
import pandas as pd
import nltk
import wordninja
import praw
import numpy as np
stemmer = nltk.stem.SnowballStemmer('english')
df = pd.read_csv('words.csv')
print(df)
negatives = df.to_numpy()[:, 1][1:]
positives = df.to_numpy()[:, 2][1:]
negatives = [stemmer.stem(word) for word in negatives]
positivecopy = np.array([])
for word in positives:
    try:
        positivecopy = np.append(positivecopy, stemmer.stem(word))
    except:
        continue
positives = positivecopy


def removeStopWords(sentence):
    sentenceArray = sentence.lower().split()
    output = []
    stopwords = ['ourselves', 'hers', 'between', 'yourself', 'but', 'again', 'there', 'about', 'once', 'during', 'out', 'very', 'having', 'with', 'they', 'own', 'an', 'be', 'some', 'for', 'do', 'its', 'yours', 'such', 'into', 'of', 'most', 'itself', 'other', 'off', 'is', 's', 'am', 'or', 'who', 'as', 'from', 'him', 'each', 'the', 'themselves', 'until', 'below', 'are', 'we', 'these', 'your', 'his', 'through', 'don', 'nor', 'me', 'were', 'her', 'more', 'himself', 'this', 'down', 'should', 'our', 'their', 'while',
                 'above', 'both', 'up', 'to', 'ours', 'had', 'she', 'all', 'no', 'when', 'at', 'any', 'before', 'them', 'same', 'and', 'been', 'have', 'in', 'will', 'on', 'does', 'yourselves', 'then', 'that', 'because', 'what', 'over', 'why', 'so', 'can', 'did', 'not', 'now', 'under', 'he', 'you', 'herself', 'has', 'just', 'where', 'too', 'only', 'myself', 'which', 'those', 'i', 'after', 'few', 'whom', 't', 'being', 'if', 'theirs', 'my', 'against', 'a', 'by', 'doing', 'it', 'how', 'further', 'was', 'here', 'than']
    for word in sentenceArray:
        if word in stopwords:
            continue
        output.append(stemmer.stem(word))
    return output


def processTopics(topic):
    for i in range(len(topic)):
        topic[i] = topic[i].lower()
    return topic


def evaluateSentence(sentence):
    numPositives = 0
    numNegatives = 0
    if type(sentence) == str:
        processed = removeStopWords(sentence)
    else:
        processed = processTopics(sentence)
    for word in processed:
        if word in positives:
            numPositives += 1
        if word in negatives:
            numNegatives -= 2
    return (numNegatives + numPositives) / len(processed)


def getPosts():
    reddit = praw.Reddit(client_id='hmvpRlG1tw-8CTmfttMqNg',
                         client_secret='5m6nIRm-YPZ9vdyt5N_9agvUuYEqoQ',
                         user_agent='agentbobjelly')

    pop_posts = reddit.subreddit('popular').hot(limit=100)
    output = []
    for post in pop_posts:
        # if 'jpg' not in post.url and 'png' not in post.url and 'jpeg' not in post.url:
        #     continue
        subredditScore = evaluateSentence(
            wordninja.split(str(post.subreddit.display_name)))
        # print(subredditScore)
        # print(subredditScore, post['data']['subreddit'])
        try:
            description = post.selftext
        except:
            dscription = 'None'
        totalScore = ((subredditScore * 2) +
                      evaluateSentence(post.title)) / 3.0
        output.append({post.title: {"positivity": totalScore, "img": post.url,
                      'subreddit': post.subreddit.display_name, 'description': description}})
    return {'data': output}


# getPosts()
# https://v.redd.it/20x1jwij73ua1/DASH_1080.mp4
