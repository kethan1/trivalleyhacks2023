# from flask import Flask, render_template, request
# from PIL import Image
# import pytesseract

# app = Flask(__name__)

# @app.route('/')
# def index():
#     return render_template('index.html')

# @app.route('/', methods=['POST'])
# def upload_image():
#     # Get the uploaded image file
#     image = request.files['image']

#     # Open the image file using Pillow
#     image = Image.open(image)

#     # Convert the image to grayscale
#     image = image.convert('L')

#     # Use Tesseract to extract text from the image
#     text = pytesseract.image_to_string(image)

#     # Return the extracted text to the user
#     return render_template('index.html', text=text)

# if __name__ == '__main__':
#     app.run(debug=True)


from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import PyPDF2
import os
import openai

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return "hi"


@app.route('/make_test', methods=['POST', 'GET'])
def test():
    # Get the uploaded PDF file
    # return 'hi'
    try:
        pdf = request.files['pdf']
        start_page = 1  # int(request.form["start_page"]) - 1
        end_page = 2  # int(request.form["end_page"]) - 1
        # return "text"
        if start_page < 0 or start_page > end_page:
            return "Invalid start page"

        # Open the PDF file using PyPDF2
        # return "text"
        pdf_reader = PyPDF2.PdfReader(pdf)
        # return "text"
        # Read the text from each page of the PDF file
        # return "text"
        text = ''
        bold_words = []
        # return "text"
        for i in range(start_page, end_page+1):
            page = pdf_reader.pages[i]
            page_text = page.extract_text()
            text += page_text + "\n"

            # Find bolded words in the page text
            for word in page_text.split():
                if word.startswith('<b>') and word.endswith('</b>'):
                    bold_words.append(word[3:-4])
        # return "text"
        openai.api_key = "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"

        textbook = str(text)
        # return str(text)
        openai.api_key = "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"

        prompt = f"""
            From the provided textbook excerpt, create a practice test with questions that would likely appear on a real test. You should only ask questions regarding content present in the source. Do NOT make things up.
            
            {textbook}

            Answer in this format:
            'Question: answer'
            """
        message = [{"role": "user", "content": prompt}]


        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=message,
            temperature=0.2,
            max_tokens=1000,
            frequency_penalty=0.0
        )

        questions = response['choices'][0]['message']['content']
        
        questions = questions.replace('Answer:', "")

        questions = questions.split('\n')
        # print(questions)
        response = []
        for i in range(2, len(questions), 3):
            response.append({"question": questions[i-2],
                             "answer": questions[i-1]})
        print(response)
        # temp = []
        # for i in range(len(questions)):
        #     if temp != '':
        #         temp.append(questions[i])

        # problems = temp[:int(len(temp)/2) - 1]
        # answers = temp[int(len(temp)/2) + 1:]

        # response = []
        # for i in range(len(problems)):
        #     response.append({problems[i]: answers[i]})

        return jsonify({"response": response})
    except Exception as e:
        return str(e)

@app.route('/read', methods=['POST', 'GET'])
def read_pdf():
    # Get the uploaded PDF file
    # return 'hi'
    try:
        pdf = request.files['pdf']
        start_page = 100 #int(request.form["start_page"]) - 1
        end_page = 101 #int(request.form["end_page"]) - 1
        # return "text"
        if start_page < 0 or start_page > end_page:
            return "Invalid start page"

        # Open the PDF file using PyPDF2
        # return "text"
        pdf_reader = PyPDF2.PdfReader(pdf)
        # return "text"
        # Read the text from each page of the PDF file
        # return "text"
        text = ''
        bold_words = []
        # return "text"
        for i in range(start_page, end_page+1):
            page = pdf_reader.pages[i]
            page_text = page.extract_text()
            text += page_text + "\n"

            # Find bolded words in the page text
            for word in page_text.split():
                if word.startswith('<b>') and word.endswith('</b>'):
                    bold_words.append(word[3:-4])
        # return "text"
        openai.api_key = "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"

        textbook = str(text)
        # return 'textbook'
        prompt = f"""
            From the provided textbook excerpt, create 10 flashcards with questions and answers of useful knowledge. You should only ask questions regarding content present in the source. Do NOT make things up.
            
            {textbook}

            Answer in this format:
            '(Question): (Answer)'
            """
        message=[{"role": "user", "content": prompt}]
        # return "text"
        # return message
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages = message,
            temperature=0.2,
            max_tokens=1000,
            frequency_penalty=0.0
        )
        # return "text"
        # return str(response)
        questions = response['choices'][0]['message']['content']


        # questions = "1. What is quantum mechanics?\n- Quantum mechanics is a fundamental theory in physics that describes the physical properties of nature at the atomic and subatomic scale.\n\n2. What are some fields that rely on quantum mechanics?\n- Quantum chemistry, quantum field theory, quantum technology, and quantum information science all rely on quantum mechanics.\n\n3. How does classical physics differ from quantum mechanics?\n- Classical physics describes nature at a macroscopic scale, while quantum mechanics describes nature at an atomic and subatomic scale. Quantum mechanics introduces concepts such as quantization, wave-particle duality, and the uncertainty principle.\n\n4. What is quantization?\n- Quantization refers to the restriction of energy, momentum, angular momentum, and other quantities of a bound system to discrete values in quantum mechanics.\n\n5. What is wave-particle duality?\n- Wave-particle duality is the concept that objects in quantum mechanics exhibit characteristics of both particles and waves. They can behave as particles or waves depending on the experiment or observation.\n\n6. What is the uncertainty principle?\n- The uncertainty principle states that there are limits to how accurately the value of a physical quantity can be predicted prior to its measurement, given a complete set of initial conditions. It introduces inherent uncertainty in certain pairs of physical properties, such as position and momentum.\n\n7. How did quantum mechanics develop?\n- Quantum mechanics gradually developed from attempts to explain observations that couldn't be reconciled with classical physics. Max Planck's solution to the black-body radiation problem and Albert Einstein's explanation of the photoelectric effect were early contributions. The full development of quantum mechanics occurred in the mid-1920s by scientists like Niels Bohr, Erwin Schr\u00f6dinger, Werner Heisenberg, Max Born, Paul Dirac, and others.\n\n8. What is the role of the wave function in quantum mechanics?\n- In one mathematical formalism of quantum mechanics, the wave function provides information, in the form of probability amplitudes, about what measurements of a particle's energy, momentum, and other physical properties may yield. It is a mathematical entity that describes the quantum state of a system."
        questions = questions.split('\n')
        print(questions)
        # return str(questions)
        for i, question in enumerate(questions):

            if question == "":
                questions.remove(question)

            if "-" in question:
                questions[i] = question.replace('-', "")
        # return "text"
        flashcards = []
        for i in range(1, len(questions), 2):
            flashcards.append({"question": questions[i-1][3:],
                               'answer': questions[i]})

        print(flashcards)
        # return "text"
        # return {'text': text, 'bold_words': bold_words}
        return jsonify({"response": flashcards})
    
    except Exception as e:
        return str(e)
if __name__ == '__main__'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                :
    app.run(debug=True)
    