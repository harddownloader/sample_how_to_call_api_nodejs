import { Request, Response } from "express";


export const newOrder = async (req: Request, res: Response) => {
    const url = `${process.env.P2P_API_PATH}token/`
    const access_token = await fetch(url, {
        method: 'POST',
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: process.env.TEST_USER_USERNAME,
            password: process.env.TEST_USER_PASSWORD
        })
    })
    .then((res) => res.json())
    .then((res) => res?.access)
    .catch(error => {
        console.warn(`get tokens failed, error: ${error}`)
        console.warn(error)
    })

    const newOrderRes = await fetch(`${process.env.P2P_API_PATH}orders`, {
        method: 'POST',
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        },
        body: JSON.stringify({
            "orderId": "98712372376427",
            "date": "2023-06-22T12:30:01",
            "card": "4455555555555555",
            "payoutAmount": 60000.00,
            "callbackUrl": process.env.OUR_CALLBACK_URL,
            "callbackMethod": "PATCH",
            "callbackHeaders": JSON.stringify({
                "custom-header-key-1": "custom-header-value-1",
                "custom-header-key-2": "custom-header-value-2",
                "custom-header-key-3": "custom-header-value-3",
            }),
            "callbackBody": JSON.stringify({
                "custom-body-key-1": "custom-body-value-1",
                "custom-body-key-2": "custom-body-value-2" 
            })
        })
    })
    .then((res) => res.json())
    .catch(error => {
        console.warn(`create order failed, error: ${error}`)
        console.warn(error)
    })

    if (newOrderRes) {
        return res.status(200).json({
            order: newOrderRes
        });
    }

    return res.status(400).json({
        'msg': 'Something went wrong'
    });
}
