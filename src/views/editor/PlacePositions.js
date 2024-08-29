// import { postFormData } from "src/apis/api";

// Handle Grid Click 
// const handleImageStamp = async (e) => {
//     const files = e.target.files[0];

//     // upload image 
//     const postData = {
//         image: files
//     };
//     const apiData = await postFormData(postData); // Specify the endpoint you want to call
//     // console.log(apiData)
//     if (apiData.path === null || apiData.path === undefined || apiData.path === "") {
//         // toastAlert("error", "Error uploading Files")
//     } else {
//         // toastAlert("success", "Successfully Upload Files")
//         console.log("result")
//         console.log(apiData.path)

//         const url = apiData.path
//         // setSavedCanvasData([...savedCanvasData, { x: XSignature, y: YSignature, type, url, width: 100, height: 100, bgImg: activeImage }]);
//         // const canvasDatalength = savedCanvasData.length
//         // setIndexSelected(canvasDatalength)
//         // setType("")
//     }

// }
export const handlePlacePosition = (event, index, type, activeImage, imageUrlSig, imageUrlLines) => {

    console.log(index)
    // const rect = event.currentTarget.getBoundingClientRect();
    // const x = event.clientX - rect.left;
    // const y = event.clientY - rect.top;
    // console.log(x)
    // console.log(y)
    // // Log the mouse coordinates relative to the active image
    // console.log(`Mouse X: ${x}, Mouse Y: ${y}`);
    // Add type 
    if (type === "my_text") {
        // setTextModal(true)
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const text = "Text"
        const FontFam = "Arial, sans-serif"
        const fontSize = 20
        const color = "#000"
        const savedCanvasData = {
            x,
            y,
            text,
            width: 200,
            height: 60,
            type,
            fontSize: fontSize,
            color: color,
            fontFamily: FontFam,
            bgImg: activeImage
        }
        const canvasDatalength = savedCanvasData.length
        console.log("savedCanvasData")
        return savedCanvasData;
    } else if (type === "my_signature") {
        //    Here event has x,y coordinates of the click
        console.log("Signature")
        console.log(event)
        const savedCanvasData = {
            x: event.x,
            y: event.y,
            url: imageUrlSig,
            lines: imageUrlLines || null,
            width: 200,
            height: 60,
            type,
            bgImg: activeImage
        }

        return savedCanvasData;
    } else if (type === "date") {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const TodayDate = new Date();
        // const text = fDateTime(TodayDate)
        // Create a new Date object to get the current date and time
        const currentDate = new Date();
        const fontSize = 20
        // Format the date in the desired format
        const options = {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short',
        };
        const text = currentDate.toLocaleDateString('en-US', options);
        const savedCanvasData = {
            x,
            y,
            text,
            width: 200,
            height: 60,
            type,
            fontSize: fontSize,
            bgImg: activeImage
        }

        return savedCanvasData;
    } else if (type === "checkmark") {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const text = "✔"
        // Create a new Date object to get the current date and time
        const fontSize = 20
    
        const savedCanvasData = {
            x,
            y,
            text,
            width: 200,
            height: 60,
            type,
            fontSize: fontSize,
            bgImg: activeImage
        }

        return savedCanvasData;
    }else if (type === "highlight") {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const text = "✔"
        // Create a new Date object to get the current date and time
        const fontSize = 20
    
        const savedCanvasData = {
            x,
            y,
            text,
            width: 200,
            height: 60,
            type,
            fontSize: fontSize,
            bgImg: activeImage
        }

        return savedCanvasData;
    }else if (type === "stamp") {
        const savedCanvasData = {
            x: event.x,
            y: event.y,
            url: imageUrlSig,
            lines: imageUrlLines || null,
            width: 200,
            height: 200,
            type,
            bgImg: activeImage
        }

        return savedCanvasData;
    } else {

    }

}
