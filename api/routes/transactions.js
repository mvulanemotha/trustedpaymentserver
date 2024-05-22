const express = require("express")
const router = express.Router()
const transactions = require("../modal/transactions")


// process a cash out payment
router.put("/payment", async (req, res) => {

    await transactions.cashoutOutATrustedPayment(req.body.voucher, req.body.pin).then(data => {

        if ((!(data === undefined))) {

            if (data["count"] === 1) {
                res.status(200).json({ message: "updated" })
            }

        } else {
            res.status(200).json({ message: "failed" })
        }

    })

})


//verify trusted payment
router.get("/verify", async (req, res) => {

    await transactions.verifyTrustedPayment(req.query.voucher, req.query.contact).then(data => {
        res.status(200).json(data)
    })
})


router.post("/save", async (req, res) => {

    try {
        // save a transaction
        await transactions.saveTransaction(req.body.data).then(data => {

            if ((Object.keys(data).length) === 4) {

                //send sms to 

                res.status(201).json(data)
            } else {
                res.status(500)
            }

        })

    } catch (error) {
        console.log(error.message)
    }
})


module.exports = router 