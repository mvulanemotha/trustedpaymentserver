const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const crypto = require('crypto')

//save a transaction

const saveTransaction = async (data) => {

    try {

        //save on Sender table
        const Sender = await prisma.Sender.create({
            data: {
                payType: data.payType,
                contact: data.senderContact
            }
        })

        //save on the Recipient
        const Recipient = await prisma.Recipient.create({

            data: {
                name: data.name,
                surname: data.surname,
                identificationNumber: data.id,
                contact: data.recipientsNumber,
                senderId: Sender.id
            }
        })

        //save on transactions
        const Transactions = await prisma.Transactions.create({
            data: {
                amount: (data.amount).toString(),
                validDays: parseInt(data.validDays),
                senderId: Sender.id,
                reference: data.reference
            }
        })

        // create a Vourcher number linking to a transaction
        const Vourchers = await prisma.Vourchers.create({
            data: {
                vorcherNo: generateSixValue("VoucherNo"),
                pin: generateSixValue("pin"),
                transactionsId: Transactions.id
            }
        })

        return { Sender, Recipient, Transactions, Vourchers }

    } catch (error) {
        console.log(error.message)
    }
}

// generate randomly six digit number

const generateSixValue = (type) => {

    try {

        if (type === "pin") {
            return Math.random().toString().substring(2, 6)
        } else {
            return Math.random().toString().substring(2, 8)
        }

    } catch (error) {
        console.log(error.message)
    }

}

// verify trusted payment
let verifyTrustedPayment = async (vorcherNo, contact) => {

    try {

        const VourcherDetails = await prisma.Vourchers.findMany({
            where: {
                OR: [
                    { vorcherNo: vorcherNo },
                    { pin: vorcherNo }
                ]
            },
            include: {
                Transaction: true,
            }
        })

        const Transaction = await prisma.Transactions.findMany({
            where: {
                id: VourcherDetails[0].Transaction.id
            },
            include: {
                sender: true
            }
        })

        const Recipient = await prisma.Recipient.findMany({
            where: {
                AND: [
                    { id: Transaction[0].sender.id },
                    { contact: contact }
                ]
            }
        })

        return { Transaction, Recipient }

    } catch (error) {
        console.log(error.message)
    }
}

// cash out a trusted payment
let cashoutOutATrustedPayment = async (voucherNo, pin) => {

    try {

        let vorcherNo = voucherNo
        let pinNo = pin
        //get a transaction id fro m vourcher

        const transId = await prisma.Vourchers.findMany({

            where: {
                AND: [
                    { vorcherNo: vorcherNo },
                    { pin: pinNo }
                ]
            }

        })

        if (transId.length > 0) {

            const updateTransactions = await prisma.Transactions.updateMany({
                where: {
                    AND: [
                        {
                            id: transId[0].transactionsId
                        }, {
                            Status: 0
                        }
                    ]
                },
                data: {
                    Status: 1
                }
            })

            return updateTransactions
        }

    } catch (error) {
        console.log(error.message)
    }

}

//cashoutOutATrustedPayment()

module.exports = { saveTransaction, generateSixValue, verifyTrustedPayment, cashoutOutATrustedPayment }