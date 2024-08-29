import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  Modal,
  CardBody,
  CardText,
  CardTitle,
  ListGroup,
  ModalBody,
  ModalHeader,
  DropdownMenu,
  DropdownItem,
  ListGroupItem,
  DropdownToggle,
  UncontrolledDropdown,
  Button,
  Label,
  Row,
  Col
} from "reactstrap";
import { selectThemeColors } from '@utils'
import html2canvas from 'html2canvas';
import { Document, Page, pdfjs } from 'react-pdf';
import Select, { components } from 'react-select'
import { FileText, Users, Link } from 'react-feather'
import { post, postFormData } from "../urls/api";
import { useNavigate } from "react-router-dom";
import DataTableServerSide from "../@core/components/table/TableServerSide"
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const FileUpload = () => {

  const [show, setShow] = useState(false)

  // file upload 
  const [FilesSelectedResults, setFilesSelectedResults] = useState([])
  const [selectedImages, setSelectedImages] = useState([])
  const [currentLargeImage, setCurrentLargeImage] = useState('')
  const [fileType, setFileType] = useState('')
  const [width, setWidth] = useState(500)
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleImageChange = async (e) => {
    const files = e.target.files;
    console.log(files[0].name)

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileType = file.type;

      // if (fileType.startsWith('image/')) {
      //   console.log("Imges")

      //   console.log(files)
      //   setFilesSelectedResults(files)


      //   const selectedUrls = Array.from(files).map(file => URL.createObjectURL(file));

      //   setSelectedImages(selectedUrls);
      //   setCurrentLargeImage(selectedUrls[0]);
      //   setFileType('Images')
      //   setWidth(500)

      //   // Handle image file
      // } else
      if (fileType === 'application/pdf') {
        // Handle PDF file
        console.log("pDF")
        const pdfFile = file
        console.log(pdfFile)
        // convert pdf into images 
        const Pdf_Url = URL.createObjectURL(pdfFile)
        const pdfFileName = pdfFile.name
        setSelectedImages(pdfFile)
        setFileType('pdf')
        setWidth("80%")


      } else {
        alert('Unsupported file type: ' + fileType);
      }
    }
  }
  // capture page as image 
  const capturePageAsImage = async (pageNumber) => {
    const page = document.querySelector(`.react-pdf__Page[data-page-number="${pageNumber}"]`);
    // const canvas = await html2canvas(page);
    // const imageBlob = await new Promise((resolve) => {
    //   canvas.toBlob((blob) => resolve(blob), 'image/png');
    // });
    // const imageUrl = URL.createObjectURL(imageBlob);
    // return imageUrl;
    // Create a new canvas element for this specific page
    const pageSelector = `.react-pdf__Page[data-page-number="${pageNumber}"]`;
    const pages = document.querySelectorAll(pageSelector);

    if (pages.length === 0) {
      return null; // Return null if the page with the specified number is not found.
      console.log("not found page")
    }

    const canvas = await html2canvas(pages[0]); // Capture the first matching page.
    console.log(canvas)

    const imageBlob = await new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
    //  create Image file 
    const fileName = `page_${pageNumber}.png`;
    const imageUrl = new File([imageBlob], fileName, { type: 'image/png' });
    //  const imageUrl = URL.createObjectURL(imageBlob);
    return imageUrl;
  };
  const [pageImages, setPageImages] = useState([]);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const navigate=useNavigate()
  const [loaderUpload, setloaderUpload] = useState(false)
  // imagess ready to converet 
  const handleImagesReady = async (images) => {
    // setImageUrls(images);
    console.log("Images pdf Pages")
    console.log(images); // ConsopostFle log the images array
   if(images.length>0){ 
    console.log("empty")
   }else{
     const postData = {
      user_id: "100000",
      file_name: selectedImages.name,
      subfolder: "false",
      subfolder_id: "subFolder_id",
      bgimgs: images,




    };
    try {
      const apiData = await post('file/create-file', postData); // Specify the endpoint you want to call
      console.log("Get By Folder Id")

      console.log(apiData)

      if (apiData.error) {
          console.log("error", apiData.message)
          // setData(apiData.result)
      } else {
          const file_idData = apiData.data.file_id
          const type="pdf"
          // setData(apiData.result)
          // ImageGet(ArrayData, fileType,file_idData);
          // ImageGet(images, "pdf", file_idData);
          console.log("image")

          console.log(images)
          console.log(type)
          console.log("file_id")
  
          console.log(file_idData)
          // api call to get Images 
          // setImageUrls(images)
          // Upload Images to db create file  
  
  
          localStorage.setItem('@images', JSON.stringify({ urls: images, type: type, file_id: file_idData }))
          navigate(`/add_document/${file_idData}`)
      }
    } catch (error) {
      console.log('Error fetching data:', error);
    }
   }
   
  };
  // convert file to images 
  const convertToImages = async () => {
    // setloaderUpload(true)
    const images = [];
    for (let i = 1; i <= numPages; i++) {
      const imageUrl = await capturePageAsImage(i);
      images.push(imageUrl);
    }
    console.log("mages")

    console.log(images)
    // logic to upload images 
    console.log("IIII")
    let ArrayData = []
    for (let i = 0; i < images.length; i++) {
      // console.log(postData.image)
      const postData = {
        image: images[i]
      };
      const apiData = await postFormData(postData); // Specify the endpoint you want to call
      // console.log(apiData)
      if (apiData.path === null || apiData.path === undefined || apiData.path === "") {
        // toastAlert("error", "Error uploading Files")
      } else {
        // toastAlert("success", "Successfully Upload Files")
        ArrayData.push(apiData.path)
      }
      // ArrayData.push()
    }

    console.log("Images pdf Pages")
    console.log(ArrayData); // ConsopostFle log the images array
   if(ArrayData.length===0){ 
    console.log("empty")
   }else{
    console.log("ArrayDataDDDDDDD")

    console.log(ArrayData)
     const postData = {
      user_id: "1",
      file_name: selectedImages.name,
      subfolder: "false",
      subfolder_id: "",
      bgimgs: ArrayData,
    };
    try {
      const apiData = await post('file/create-file', postData); // Specify the endpoint you want to call
      console.log("Get By Folder Id")

      console.log(apiData)

      if (apiData.error) {
          console.log("error", apiData.message)
          // setData(apiData.result)
      } else {
          const file_idData = apiData.data.file_id
          const type="pdf"
          // setData(apiData.result)
          // ImageGet(ArrayData, fileType,file_idData);
          // ImageGet(images, "pdf", file_idData);
          console.log("image")

          console.log(ArrayData)
          console.log(type)
          console.log("file_id")
  
          console.log(file_idData)
          // api call to get Images 
          // setImageUrls(images)
          // Upload Images to db create file  
  
  
          localStorage.setItem('@images', JSON.stringify({ urls: ArrayData, type: type, file_id: file_idData }))
          navigate(`/add_document/${file_idData}`)
      }
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  }

  };
  // useEffect(() => {
  //   if (pageImages.length === numPages
  //     //  && onImagesReady
  //      ) {
  //     // onImagesReady(pageImages);
  //     console.log("pageImages")

  //     console.log(pageImages)
  //   }
  // }, [pageImages, numPages
  //   // , onImagesReady
  // ]);
  return (
    <>
      {/* buton  */}
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <CardBody>
          <CardText>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </CardText>
          <Button color="primary" onClick={() => setShow(true)}>Upload File</Button>
        <Row>
          <Col md='12' sm='12'>  
             < DataTableServerSide />
            </Col>
        </Row>
    
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create Awesome 🙌</CardTitle>
        </CardHeader>
        <CardBody>
          <CardText>This is your second page.</CardText>
          <CardText>
            Chocolate sesame snaps pie carrot cake pastry pie lollipop muffin.
            Carrot cake dragée chupa chups jujubes. Macaroon liquorice cookie
            wafer tart marzipan bonbon. Gingerbread jelly-o dragée chocolate.
          </CardText>
        </CardBody>
      </Card>
      {/* Modal  */}
      <Modal isOpen={show} toggle={() => setShow(!show)} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-4'>
          <h1 className='text-center mb-1'>Upload File</h1>
          <p className='text-center'>Select pdf file </p>
          {/* make file picker  */}
          {selectedImages.length === 0 ?
            <>
              <div style={{ border: '3px dotted gray', padding: '10px' }}>

                <label htmlFor="file-upload" style={{ padding: '30px', display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
                  Click here to upload file
                </label>
                <input id="file-upload" accept=".pdf" type="file" style={{ display: 'none' }}
                  //  onChange={handleFileChange} 
                  onChange={handleImageChange}
                />
              </div></> :
            <>
              <div className='d-flex flex-column justify-content-center ' style={{ border: '3px dotted gray', padding: '10px' }}>
                <div className='d-flex flex-column align-items-center justify-content-center mb-2 me-75'>
                  <FileText className='font-large-2 me-1' />
                  <span className='fw-bolder'>{selectedImages.name}</span>
                  <Button.Ripple color='primary' style={{ width: '40%' }}
                    outline
                    onClick={convertToImages}
                  >
                    Upload
                  </Button.Ripple> </div>

              </div>
              <div style={{ height: '40vh', overflowY: 'scroll', border: '1px solid lightGray', marginTop: '10px' }}>
                <Document
                  file={URL.createObjectURL(selectedImages)}
                  onLoadSuccess={onDocumentLoadSuccess}
                  style={{ border: '1px solid blue', padding: '20px' }}
                >
                  {Array.from(new Array(numPages), (el, index) => (
                    <Page
                      renderAnnotationLayer={false} renderTextLayer={false}
                      key={`page_${index + 1}`}
                      style={{
                        marginBottom: '10px',     // Add some space between pages
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        color: 'grey'
                      }}
                      pageNumber={index + 1} >
                      {/* <div style={{ fontSize: '12px', marginTop: '10px' }}>
        Page {index + 1} of {numPages} 
      </div> */}
                    </Page>
                  ))}
                </Document>

              </div>
            </>}



          {/* <p className='fw-bolder pt-50 mt-2'>12 Members</p>

          <div className='d-flex align-content-center justify-content-between flex-wrap'>
            <div className='d-flex align-items-center me-2'>
              <Users className='font-medium-2 me-50' />
              <p className='fw-bolder mb-0'>Public to Vuexy - Pixinvent</p>
            </div>
            <a className='fw-bolder' href='#' onClick={e => e.preventDefault()}>
              <Link className='font-medium-2 me-50' />
              <span>Copy project link</span>
            </a>
          </div> */}
        </ModalBody>
      </Modal>
      {/* Modal end  */}</>
  );
};

export default FileUpload;
