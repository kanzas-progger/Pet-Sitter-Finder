from flask import Flask, request, jsonify
from openai import OpenAI
from flask_cors import CORS
import json

template = """ОБЩАЯ СТАТИСТИКА ПО СИТТЕРУ (за последние 6 месяцев):

📊 Рейтинг: 4.7 из 5
Всего отзывов: 47
Достоверность отзывов: 95%

РАСПРЕДЕЛЕНИЕ ПО ВИДАМ ЖИВОТНЫХ:
🐕 Собаки: 28 отзывов
🐱 Кошки: 15 отзывов
🦜 Птицы: 3 отзыва
🦎 Рептилии: 1 отзыв

КЛЮЧЕВЫЕ ПОКАЗАТЕЛИ:
✅ Качество ухода: 92%
📱 Коммуникация: 89%
⏰ Пунктуальность: 95%
💰 Соотношение цена/качество: 88%

СИЛЬНЫЕ СТОРОНЫ:
• Опыт работы с разными породами собак
• Отличные навыки коммуникации
• Своевременная отчетность
• Внимательность к деталям

ПОСЛЕДНИЕ ТЕНДЕНЦИИ:
📈 Улучшение: отправка фото/видео отчетов
📉 Требует внимания: гибкость графика

АНАЛИЗ УДОВЛЕТВОРЕННОСТИ:
😊 Довольные клиенты: 91%
😐 Нейтральные отзывы: 7%
😟 Негативные отзывы: 2%

СТАТИСТИКА ПО УСЛУГАМ:
• Передержка на дому: 65%
• Выгул: 25%
• Дневной присмотр: 10%

РЕКОМЕНДАЦИИ КЛИЕНТОВ:
"Порекомендую друзьям": 94%
"Обращусь снова": 89%"""


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "https://localhost:5173"}})


@app.route('/api/reviews/analize', methods=['POST'])
def chat():
    request_data = request.get_json()
    
    
    reviews_data = request_data['reviews_data']
    data = json.dumps(reviews_data, ensure_ascii=False, indent=2)
    
    
    try:
        client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key="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",
        )
        
        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "localhost",  
                "X-Title": "pet-sitter-finder",      
            },
            extra_body={},
            model="deepseek/deepseek-chat:free",
            messages=[
                {
                    "role": "user",
                    "content": f"""Проанализируй эти отзывы о передержке животных:
             {data}
            
             И сделай анализ примерно в таком виде, в зависимости, от того, 
             что будет написано в отзывах, это просто как пример {template}"""
                }
            ]
        )
        
        response_content = completion.choices[0].message.content
        
        return jsonify({
            'success': True,
            'response': response_content
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True, port=5100)


