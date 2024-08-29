import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  TabContent,
  TabPane,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  ModalFooter,
  Tooltip
} from "reactstrap";
import classnames from 'classnames'
import { selectThemeColors } from '@utils'
import Select, { components } from 'react-select'
import { FileText, Users, Link, Minimize } from 'react-feather'
import { useParams } from 'react-router-dom';
import { BASE_URL, post } from "../urls/api";
import Tabs from "./Tabs";
import ForYou from "./editor/ForYou";
import { getIconForType, getTextForType } from "../utility/utils/Constants";
import { handlePlacePosition } from "./editor/PlacePositions";
import { PositionText } from "./editor/PositionsBasedOnType";
import Draggable from 'react-draggable';
import SpinnerBorder from "../@core/components/spinner/SpinnerBorder";
// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'

const AddDocument = () => {
  const [eventDataOnClick, setEventDataOnClick] = useState(null)
  // DRAGED 
  // Drag 
  const [draggedState, setDraggedState] = useState(true)
  const handleDragStart = (data, index, event) => {
    setDraggedState(true)
  }
  const handleDragEnd = (data, index, e) => {
    console.log("event.currentTarget")
    const imgRect = imgRef.current.getBoundingClientRect();
    console.log(imgRect)
    // const relativeX = data.x - imgRect.left;
    // const relativeY = data.y - imgRect.top;
    const relativeX = data.clientX - imgRect.left;
    const relativeY = data.clientY - imgRect.top;

    console.log("Drag ended at x: " + mouseX + ", y: " + mouseY);
    // // Create a copy of the savedCanvasData array
    const updatedData = [...savedCanvasData];

    // // // Update the position of the specific element in the array
    updatedData[index].x = relativeX;
    updatedData[index].y = relativeY;
    updatedData[index].bgImg = activeImage;
    // Update the state with the modified data
    setSavedCanvasData(updatedData);





    // const rect = e.currentTarget.getBoundingClientRect();
    // console.log(rect)

    // // Calculate the new position
    // const newPosition = {
    //   x: e.clientX - rect.left,
    //   y: e.clientY - rect.top,
    // };
    // console.log(newPosition)

    console.log("Droped")
    // const newPosition = "Update"


    // Call the updatePosition function passed from the file editor
    // updatePosition(index, newPosition);
    setDraggedState(false)

    //       }else{
    //         console.log("not definefd")
    //       }
  };
  const [DragView, setDragView] = useState(false)
  // END DRAGED  
  // Mouse Positions 
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [activeTab, setActiveTab] = useState('1')
  const toggleTab = tab => {
    setActiveTab(tab)
  }
  const { id } = useParams();
  const [activeList, setActiveLIst] = useState('1')

  const toggleList = list => {
    if (activeList !== list) {
      setActiveLIst(list)
    }
  }
  const [type, setType] = useState('')
  // get type active 
  const getTypeListItem = (type) => {
    console.log("Type")
    console.log(type)
    setType(type)


  }
  const [imageUrls, setImageUrls] = useState([]);
  const [savedCanvasData, setSavedCanvasData] = useState([]);
  // Active image id
  const [activeImage, setActiveImage] = useState("")
  const handleImageClick = (imageId) => {
    setActiveImage(imageId);
    // Scroll to the clicked image in Container B
    const imageElement = document.getElementById(`image-${imageId}`);
    if (imageElement) {
      imageElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fetchData = async () => {
    // get Images from db 
    const postData = {
      file_id: id
    };
    const apiData = await post("file/getbgImagesByFileId", postData); // Specify the endpoint you want to call
    console.log("apixxsData")

    console.log(apiData)
    if (apiData.error) {
      // toastAlert("error", "No Images Selected")
    } else {
      // toastAlert("success", "You can Edit document ")

      setImageUrls(apiData.result);
      setActiveImage(apiData.result[0].bgimgs_id)
    }


  };
  const fetchDataPositions = async () => {
    // get positions from db 
    console.log(id)
    const postData = {
      file_id: id
    };
    const apiData = await post("file/getallPositionsFromFile_Id", postData); // Specify the endpoint you want to call
    console.log("Position Data")

    console.log("apiData")
    console.log(apiData)

    if (apiData.error) {
      // toastAlert("error", apiData.message)
    } else {
      // toastAlert("success", apiData.message)
      console.log('positions')
      console.log(apiData.result)
      // getCanvas Data 
      setSavedCanvasData(apiData.result[0].position_array)
    }
  };
  // deleet current position 
  const [deleteIndex, setDeleteIndex] = useState('')
  const [ItemDeleteConfirmation, setItemDeleteConfirmation] = useState(false)
  const [loadingDelete, setloadingDelete] = useState(false)
  // Delete current Positions 
  const handleDeleteCurrentPosition = (index) => {
    setDeleteIndex(index)
    setItemDeleteConfirmation(true)
  }
  const imgRef = useRef(null);
  const DeleteItemFromCanvas = () => {
    setloadingDelete(true)
    const updatedImageUrls = [...savedCanvasData];
    updatedImageUrls.splice(deleteIndex, 1); // Remove the image at the specified index
    const updatedCanvasData = [...savedCanvasData];
    updatedCanvasData.splice(deleteIndex, 1); // Remove the corresponding data
    setSavedCanvasData(updatedCanvasData); // Update the savedCanvasData state
    console.log(updatedCanvasData)
    setTimeout(() => {
      setItemDeleteConfirmation(false)
      setloadingDelete(false)
    }, 1000);

  }
  // tooltip 
  const [tooltipOpen, setTooltipOpen] = useState(false)

  useEffect(() => {
    console.log(id)
    fetchData();
    fetchDataPositions();
  }, []);
  // scroll active image 
  // const containerRef = useRef(null);
  // useEffect(() => {
  //     const handleScroll = () => {
  //         // Get the container element
  //         const container = containerRef.current;

  //         // Calculate the current scroll position relative to the container
  //         const scrollPosition = container.scrollTop;

  //         // Calculate the index of the currently visible image based on scroll position
  //         const index = Math.floor(scrollPosition / (container.clientHeight - 10));

  //         // Update the active image ID
  //         if (imageUrls[index]) {
  //             setActiveImage(imageUrls[index].bgimgs_id);
  //         }
  //     };

  //     // Attach the scroll event listener to the container element
  //     const container = containerRef.current;
  //     if (container) {
  //       container.addEventListener('scroll', handleScroll);

  //       // Initialize the active image ID when the component mounts
  //       handleScroll();

  //       // Clean up the event listener when the component unmounts
  //       return () => {
  //         container.removeEventListener('scroll', handleScroll);
  //       };
  //     }
  // }, [imageUrls]);
  useEffect(() => {
    const container = document.getElementById('container1');
    if (!container) return; // Exit if the container doesn't exist
    // Add event listener to update mouse coordinates
    const updateMousePosition = (e) => {
      const rect = container.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // console.log(x)
      // console.log(y)

      setMouseX(x - 14);
      setMouseY(y - 20);



    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      // Remove event listener when component unmounts
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);
  return (
    <>
      {/* buton  */}
      <Card>
        <CardHeader>
          <CardTitle>Editor</CardTitle>
        </CardHeader>
        <CardBody>

          {/* <Button color="primary" onClick={() => setShow(true)}>Go somewhere</Button> */}
          {/* Editor  */}
          <Row>
            <Col md='3' sm='12'>
              <Tabs className='mb-2' activeTab={activeTab} toggleTab={toggleTab} />

              <TabContent activeTab={activeTab}>
                <TabPane tabId='1'>
                  <ForYou type={getTypeListItem} />
                  <ListGroup tag='div'>
                    <ListGroupItem
                      className={classnames('cursor-pointer', {
                        active: activeList === '1'
                      })}
                      onClick={() => toggleList('1')}
                      action
                    >
                      Text
                    </ListGroupItem>
                    <ListGroupItem
                      className={classnames('cursor-pointer', {
                        active: activeList === '2'
                      })}
                      onClick={() => toggleList('2')}
                      action
                    >
                      Signature
                    </ListGroupItem>
                    <ListGroupItem
                      className={classnames('cursor-pointer', {
                        active: activeList === '3'
                      })}
                      onClick={() => toggleList('3')}
                      action
                    >
                      Date
                    </ListGroupItem>
                    <ListGroupItem
                      className={classnames('cursor-pointer', {
                        active: activeList === '4'
                      })}
                      onClick={() => toggleList('4')}
                      action
                    >
                      Settings
                    </ListGroupItem>
                  </ListGroup>
                  {/* <AccountTabContent data={data.general} /> */}
                </TabPane>
                <TabPane tabId='2'>
                  Others
                  {/* <SecurityTabContent /> */}
                </TabPane>

              </TabContent>

            </Col>
            {/* images  */}
            <Col md='7' sm='12'
              id="container1"
              // ref={containerRef}
              style={{ position: 'relative', height: '80vh', overflowY: 'scroll' }}>
              <Row>
                {imageUrls.map((item, index) => {
                  return (
                    <>
                      {/* cursor  START*/}

                      {type && activeImage === item.bgimgs_id && (
                        <div
                          onClick={(event) => {
                            console.log("eee")
                            // handleGridClick(event,
                            //     index)
                          }
                          }
                          className="custom-cursor"
                          style={{
                            zIndex: 2,
                            position: 'absolute',
                            left: `${mouseX + 100}px`,
                            top: `${mouseY + 50}px`,
                            width: '200px',
                            backgroundColor: 'white',
                            border: '1px solid lightGray'
                          }}
                        >

                          <>
                            <Row style={{ padding: "10px" }}>
                              <Col xs="3" md="3">

                                {getIconForType(type)}
                              </Col>
                              <Col xs="9" md="9">

                                {getTextForType(type)}
                              </Col>
                            </Row>
                          </>



                        </div>

                      )}


                      {/* cursor  END*/}
                      {/* Background Images  */}
                      <Col md='12' sm='12' key={index}>
                        position x:{mouseX} position y:{mouseY}
                        <img
                          ref={imgRef}
                          onClick={(e) => {

                            console.log(item.bgimgs_id)
                            handleImageClick(item.bgimgs_id)
                            let resultingData = handlePlacePosition(e, index, type, activeImage)
                            console.log(resultingData)
                            setSavedCanvasData([...savedCanvasData, resultingData])
                            setType('')

                          }}
                          alt={`Image ${item.bgimgs_id}`}
                          id={`image-${item.bgimgs_id}`}
                          style={{
                            width: '100%',
                            // border: '1px solid lightGray',
                            border: `${activeImage === item.bgimgs_id ? "2px solid #62bcdd" : "1px solid lightGray"}`
                          }}
                          src={`${BASE_URL}${item.image}`}
                        />
                      </Col>
                      <Col md="12" sm="12" className="d-flex p-2 justify-content-center align-items-center">
                        Page {index + 1}
                      </Col>
                      {/* backgriund images end  */}
                      {/* Editor positions  */}
                      <Col md='12' sm='12' >
                        {savedCanvasData.map((position, index) => (
                          <>
                            <Draggable
                              key={index}
                              disabled={draggedState} // Disable dragging when the condition is not met
                              onStop={(e, data) => handleDragEnd(data, index, e)} // Handle drag end
                              onStart={(e, data) => handleDragStart(data, index, e)} // Add this line
                            >
                              <div
                                key={index}
                                onClick={(event) => {
                                  console.log("eee")
                                  // handleGridClick(event,
                                  //     index)
                                }
                                }
                                style={{
                                  zIndex: 2,
                                  position: 'absolute',
                                  left: position.x + 'px',
                                  top: position.y + 'px',
                                  color: 'black',
                                  width: `${position.width}+px`,
                                  backgroundColor: 'transparent', //position
                                  border: '1px solid orange',
                                  display: `${position.bgImg === item.bgimgs_id ? "block" : "none"}`
                                }}
                              >

                                {position.type === "my_text" && position.bgImg === item.bgimgs_id && (
                                  <>

                                    {/* Drag  */}
                                    <div
                                      className="hover-div"
                                      style={{
                                        position: 'absolute',
                                        bottom: -45,
                                        right: 50,
                                        zIndex: 2,
                                        backgroundColor: 'white',
                                        cursor: 'pointer',
                                        border: '1px solid gray',
                                        padding: '3px',
                                        borderRadius: '50%'
                                      }}

                                    >

                                      {/* <Tooltip title="Drag">  */}
                                      <span id='Draggable'
                                        onMouseDown={() => {
                                          setDraggedState(false);
                                        }}> <Minimize size={17} className='align-middle' /></span>
                                      <Tooltip
                                        placement='top'
                                        isOpen={tooltipOpen}
                                        target='Draggable'
                                        toggle={() => setTooltipOpen(!tooltipOpen)}
                                      >
                                        Drag !
                                      </Tooltip>
                                      {/* <IconButton size="small"
                                onMouseDown={() => {
                                    setDraggedState(false);
                                }}
                                style={{ backgroundColor: 'white', cursor: 'grab', border: '1px solid gray' }}>
                                <Iconify icon="fluent:drag-20-filled" color="black" />
                            </IconButton>
                                      </Tooltip>  */}

                                    </div>
                                    <PositionText
                                      position={position}
                                      text={position.text}
                                      index={index}
                                      updatedText={(updatText) => {
                                        savedCanvasData[index].text = updatText
                                        console.log(savedCanvasData)

                                      }}
                                      updatedWidth={(updatText) => {
                                        savedCanvasData[index].width = updatText
                                        console.log("updatText")
                                        savedCanvasData[index].fontSize = updatText / 10; // Update the font size based on the new width

                                        console.log(updatText)
                                        console.log(savedCanvasData)
                                      }}
                                      updatedHeight={(updatText) => {
                                        savedCanvasData[index].height = updatText
                                        console.log(savedCanvasData)
                                      }}
                                      // updatePosition={(index, newPosition) => {
                                      //   console.log("Event Posigtion ")
                                      //   console.log(eventDataOnClick)
                                      //   if (newPosition === "Update") {

                                      //   } else {

                                      //   }
                                      //   console.log("index")

                                      //   console.log(index)
                                      //   console.log(newPosition)

                                      //   // // Create a copy of the savedCanvasData array
                                      //   const updatedData = [...savedCanvasData];

                                      // }}
                                      removeSelectedImage={handleDeleteCurrentPosition}
                                    />
                                    {/* </Draggable> */}


                                  </>

                                )}
                              </div>
                            </Draggable>
                          </>
                        ))}
                      </Col>
                      {/* End Editor Positions  */}

                    </>
                  )
                })}
              </Row>


            </Col>
            {/* side images tO actIve image */}
            <Col md='2' sm='12' style={{ height: '80vh', overflowY: 'scroll' }}>
              <Row>

                {imageUrls.map((item, index) => {
                  return (
                    <>
                      <Col md='12' sm='12' key={index}>
                        <img
                          key={item.bgimgs_id}
                          alt={`Image ${item.bgimgs_id}`}
                          onClick={() => handleImageClick(item.bgimgs_id)}
                          style={{
                            width: '100%',
                            border: `${activeImage === item.bgimgs_id ? "2px solid #62bcdd" : "1px solid lightGray"}`
                          }}
                          src={`${BASE_URL}${item.image}`} />
                      </Col>
                      <Col md="12" sm="12" className="d-flex p-1 justify-content-center align-items-center" >
                        Page {index + 1}
                      </Col>
                    </>
                  )
                })}
              </Row>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Modal Delete  */}
      <Modal isOpen={ItemDeleteConfirmation} toggle={() => setItemDeleteConfirmation(!ItemDeleteConfirmation)} className='modal-dialog-centered modal-md'>
        <ModalHeader className='bg-transparent' toggle={() => setItemDeleteConfirmation(!ItemDeleteConfirmation)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-1'>
          <h2 className='fw-bolder mb-1'>Are you sure you want to delete ? </h2>
        </ModalBody>
        <ModalFooter>
          <Button.Ripple color='primary'
            onClick={() => DeleteItemFromCanvas()}
          >
            {
              loadingDelete ? <SpinnerBorder /> : null
            }
            <span className='align-middle ms-25'>Yes</span>
          </Button.Ripple>
          <Button color='danger'

            onClick={() => setItemDeleteConfirmation(!ItemDeleteConfirmation)}
          >
            No
          </Button>
        </ModalFooter>
      </Modal>

      {/* End  */}

    </>
  );
};

export default AddDocument;
