const axios = require("axios")
axios.get('https://api.wit.ai/message?v=20220714&q=Anita%20Bye', {
    headers: {
        'Authorization': 'Bearer JSI6WM62WEHPNQ7DIPQETE5EMEJHSAPT'
    }
}).then(
    (res) => {
        console.log(res.data)
        console.log(res.data.entities)
    }
)