from flask import Flask, request, jsonify
from openai import OpenAI
import os




app = Flask(__name__)

# Конфигурационные переменные (лучше хранить в переменных окружения)
# OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "<OPENROUTER_API_KEY>")
# SITE_URL = os.environ.get("SITE_URL", "<YOUR_SITE_URL>")
# SITE_NAME = os.environ.get("SITE_NAME", "<YOUR_SITE_NAME>")

@app.route('/api/chat', methods=['POST'])
def chat():
    # Получаем данные из POST запроса
    request_data = request.get_json()
    
    # Проверяем наличие обязательных полей
    if 'backend_data' not in request_data:
        return jsonify({'error': 'backend_data is required'}), 400
    
    backend_data = request_data['backend_data']
    
    # Опционально можно передать модель
    #model = request_data.get('model', 'deepseek/deepseek-chat:free')
    
    try:
        # Инициализируем клиент OpenAI с OpenRouter как базовым URL
        client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key="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",
        )
        
        # Создаем запрос к API
        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "localhost",  # Опционально. URL сайта для рейтингов на openrouter.ai
                "X-Title": "pet-sitter-finder",      # Опционально. Название сайта для рейтингов на openrouter.ai
            },
            extra_body={},
            model="deepseek/deepseek-chat:free",
            messages=[
                {
                    "role": "user",
                    "content": backend_data
                }
            ]
        )
        
        # Получаем результат
        response_content = completion.choices[0].message.content
        
        # Возвращаем результат
        return jsonify({
            'success': True,
            'response': response_content
        })
    
    except Exception as e:
        # Обработка ошибок
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    # Запуск приложения в режиме разработки
    app.run(debug=True)

# backend_data = [
#     {
#         "content": "Спасибо Юле за помощь в очередной раз с передержкой. Была спокойна за Зевса, т к получала регулярные фото и видеоотчеты)",
#         "stars": 5
#     },
#     {
#         "content": "К моему огромному сожалению собаку после передержки лечу от цистита.",
#         "stars": 1
#     },
#     {
#         "content": "Стич был очень рад новой встрече! Постоянная связь с Юлией позволила получить ещё больше фото и видео питомца. Огромное спасибо!",
#         "stars": 5
#     },
#     {
#         "content": "Все хорошо",
#         "stars": 1
#     }
# ]

# template = """ОБЩАЯ СТАТИСТИКА ПО СИТТЕРУ (за последние 6 месяцев):

# 📊 Рейтинг: 4.7 из 5
# Всего отзывов: 47
# Достоверность отзывов: 95%

# РАСПРЕДЕЛЕНИЕ ПО ВИДАМ ЖИВОТНЫХ:
# 🐕 Собаки: 28 отзывов
# 🐱 Кошки: 15 отзывов
# 🦜 Птицы: 3 отзыва
# 🦎 Рептилии: 1 отзыв

# КЛЮЧЕВЫЕ ПОКАЗАТЕЛИ:
# ✅ Качество ухода: 92%
# 📱 Коммуникация: 89%
# ⏰ Пунктуальность: 95%
# 💰 Соотношение цена/качество: 88%

# СИЛЬНЫЕ СТОРОНЫ:
# • Опыт работы с разными породами собак
# • Отличные навыки коммуникации
# • Своевременная отчетность
# • Внимательность к деталям

# ПОСЛЕДНИЕ ТЕНДЕНЦИИ:
# 📈 Улучшение: отправка фото/видео отчетов
# 📉 Требует внимания: гибкость графика

# АНАЛИЗ УДОВЛЕТВОРЕННОСТИ:
# 😊 Довольные клиенты: 91%
# 😐 Нейтральные отзывы: 7%
# 😟 Негативные отзывы: 2%

# СТАТИСТИКА ПО УСЛУГАМ:
# • Передержка на дому: 65%
# • Выгул: 25%
# • Дневной присмотр: 10%

# РЕКОМЕНДАЦИИ КЛИЕНТОВ:
# "Порекомендую друзьям": 94%
# "Обращусь снова": 89%"""


# client = OpenAI(
#   base_url="https://openrouter.ai/api/v1",
#   api_key="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",
# )

# completion = client.chat.completions.create(
#   extra_headers={
#     "HTTP-Referer": "localhost", 
#     "X-Title": "pet-sitter-finder", 
#   },
#   extra_body={},
#   model="deepseek/deepseek-chat:free",
#   messages=[
#         {
#             "role": "user",
#             "content": f"""Проанализируй эти отзывы о передержке животных:
#             {backend_data}
            
#             И сделай анализ примерно в таком виде, в зависимости, от того, 
#             что будет написано в отзывах, это просто как пример {template}"""
#         }
#     ]
# )
# print(completion.choices[0].message.content)



# // Импортируем axios
# import axios from 'axios';

# // Функция для отправки запроса
# async function sendChatRequest(message) {
#   try {
#     // Создаем объект с данными запроса
#     const requestData = {
#       backend_data: message
#     };
    
#     // Опционально можно добавить модель
#     // requestData.model = "другая_модель";
    
#     // Отправляем POST запрос на ваш эндпоинт
#     const response = await axios.post('http://localhost:5000/api/chat', requestData);
    
#     // Проверяем успешность запроса
#     if (response.data.success) {
#       // Выводим ответ
#       console.log('Ответ:', response.data.response);
#       return response.data.response;
#     } else {
#       console.error('Ошибка:', response.data.error);
#       return null;
#     }
#   } catch (error) {
#     // Обработка ошибок соединения или других проблем
#     console.error('Произошла ошибка:', error.message);
#     if (error.response) {
#       // Сервер вернул статус ошибки
#       console.error('Статус ошибки:', error.response.status);
#       console.error('Данные ошибки:', error.response.data);
#     }
#     return null;
#   }
# }

# // Пример использования
# async function example() {
#   const message = "Привет, как дела?";
#   const response = await sendChatRequest(message);
  
#   if (response) {
#     // Обработка ответа
#     document.getElementById('response').textContent = response;
#   }
# }

# // Вызов функции
# example();

# // Пример с использованием кнопки в HTML
# /* 
# <button id="sendButton">Отправить сообщение</button>
# <div id="response"></div>

# <script>
#   document.getElementById('sendButton').addEventListener('click', async () => {
#     const userInput = document.getElementById('userInput').value;
#     const response = await sendChatRequest(userInput);
#     if (response) {
#       document.getElementById('response').textContent = response;
#     }
#   });
# </script>
# */


