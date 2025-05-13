import axios from "axios";


export const AnalizeReviewsWithAi = async (reviewsData) => {

    const requestData = {
        reviews_data: reviewsData
    }

    console.log("REVIEWS DATA IS", requestData)

    try {
        const response = await axios.post(
            'http://localhost:5100/api/reviews/analize',
            requestData,
            {
                headers: {
                    'Content-Type': 'application/json', 
                },
            }
        )

        return response
    } catch (e) {
        console.error(e)
    }
}