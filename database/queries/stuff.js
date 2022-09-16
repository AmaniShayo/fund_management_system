const {request,receipt} = require('../schemas')

let stuff = {
    sendRequest:async (requestObject)=>{
        let newRequest = new request(requestObject);
        try {
            await newRequest.save();
            
        } catch (error) {
            return error;
        }
    },
    addRecept:async (recentRequestId,receiptData)=>{
        try {
            let receiptDataObject={
                requestId:request.findById(recentRequestId),
                amount:receiptData.amount,
                url:receiptData.url,
                description:receiptData.description
            }
            let newReceipt = new receipt(receiptDataObject)
            await newReceipt.save()
        } catch (error) {
            return error;
        }
    }
}