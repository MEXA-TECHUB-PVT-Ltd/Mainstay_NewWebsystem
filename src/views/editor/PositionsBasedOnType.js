import React, { useState } from 'react';
// import List from '@mui/material/List';
// import { Avatar, Box, Button, ButtonGroup, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, Tooltip, Typography } from '@mui/material';
// import Iconify from 'src/components/iconify';
import { ResizableBox } from 'react-resizable'; // Import react-resizable
import 'react-resizable/css/styles.css';
import Draggable from 'react-draggable';
// import '../stylesheet.css'
import { BASE_URL } from '../../urls/api';
import { X } from 'react-feather';
import { Input, Tooltip } from 'reactstrap';

// ------------------------------------------------------------------------------------
// ---------------------------------POSITION TEXT--------------------------------
// ------------------------------------------------------------------------------------



export function PositionText({ position, text, index, updatedText, updatedWidth, updatedHeight, updatePosition, removeSelectedImage }) {
    const [tooltipOpen, setTooltipOpen] = useState(false)
    const [editedText, setEditedText] = useState(text);
    const [edit, setEdit] = useState(true)
    const handleTextChange = (e) => {
        setEditedText(e.target.value)
        updatedText(e.target.value)

    }
    const handleTextBlur = () => {
        setEdit(false);
    };
    const handleResize = (e, { size }) => {
        // Update the width and height based on the new size
        updatedWidth(size.width);
        updatedHeight(size.height);
    };

    // Drag 
    return (
        <>
            <ResizableBox
                // className="hover-div"
                key={index}
                width={position.width}
                height={position.height}
                minConstraints={[50, 50]} // Set minimum size constraints as needed
                resizeHandles={["se", "ne", "nw", "sw"]}
                onResize={handleResize}
                style={{
                    position: 'relative',
                    backgroundColor: 'rgb(98 188 221 / 28%)',
                    textAlign: 'center',
                    padding: '10px',
                    border: '1px solid red'
                }}

                // Hover 
                onMouseEnter={() => {
                    // Show the message when hovered
                    const messageDiv = document.querySelector('.messageDiv');
                    if (messageDiv) {
                        messageDiv.style.display = 'block';
                    }

                }}

                onMouseLeave={() => {
                    // Hide the message when not hovered
                    const messageDiv = document.querySelector('.messageDiv');
                    if (messageDiv) {
                        messageDiv.style.display = 'none';
                    }

                }}
            > 

                {/* Delete  */}
                <div
                    style={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        zIndex: 2,
                        backgroundColor:'red',
                        color:'white',
                        padding:'4px',
                        borderRadius:'50%',
                        cursor:'pointer'
                    }}
                >
                    <span id='ControlledExample' onClick={() => {
                        removeSelectedImage(index);
                    }}>
                        <X size={17} className='align-middle'/>
                    </span>
                 
      <Tooltip
        placement='top'
        isOpen={tooltipOpen}
        target='ControlledExample'
        toggle={() => setTooltipOpen(!tooltipOpen)}
      >
        Delete !
      </Tooltip>
                    {/* <Tooltip title="Delete">
                            <Button
                                onClick={() => {
                                    removeSelectedImage(index);
                                }} color="error"
                                style={{
                                    borderRadius: '50%',
                                    border: '1px solid lightGray'
                                }
                                }>
                                <Iconify icon="ic:outline-delete" />
                            </Button>
                        </Tooltip> */}
                </div>
                {edit ? <>
                    <Input type='text'
                        name='email'
                        //  set Formik value email on this input 



                        value={editedText}
                        onChange={handleTextChange}
                        id='login-email'
                        placeholder='Enter Text'
                        style={{
                            fontSize: `${position.fontSize}px`,
                            color: position.color,
                            fontFamily: position.fontFamily,

                            padding: '3px',
                            border: 'none',
                            height: position.height,
                            boxShadow: 'none',
                            backgroundColor: 'transparent',
                            width: 'auto'
                        }}
                        autoFocus />
                    {/* <TextField
                        type="text"
                        value={editedText}
                        onChange={handleTextChange}
                        onBlur={handleTextBlur}
                        style={{
                            fontSize: `${position.fontSize}px`,
                            color: position.color,
                            fontFamily: position.fontFamily,

                            padding: '3px',
                            border: 'none',
                            height: position.height,
                            width: 'auto'
                        }}
                        // autoFocus={`${position.text.length===0?"false":"true"}`}
                        size='small'
                        variant='standard'
                    /> */}
                </> :
                    <>
                    <span
                    onClick={() => setEdit(true)}
                     style={{
                        fontSize: `${position.fontSize}px`,
                        color: position.color,
                        fontFamily: position.fontFamily,
                        cursor: 'pointer',
                        flexWrap: "wrap",
                        whiteSpace: 'normal',
                        border: 'none'
                    }}
                    >
                    {position.text}
                    </span>
                        {/* <Typography
                            onClick={() => setEdit(true)}
                            style={{
                                fontSize: `${position.fontSize}px`,
                                color: position.color,
                                fontFamily: position.fontFamily,
                                cursor: 'pointer',
                                flexWrap: "wrap",
                                whiteSpace: 'normal',
                                border: 'none'
                            }}
                        >
                            {position.text}
                        </Typography> */}
                    </>}

            </ResizableBox>
            {/* </Draggable> */}
        </>
    );
}
// ------------------------------------------------------------------------------------
// ---------------------------------POSITION Signature --------------------------------
// ------------------------------------------------------------------------------------

export function PositionSignature({ removeThatIndex, position, index, updatedText, updatedWidth, updatedHeight, updatePosition, removeSelectedImage }) {
    const handleResize = (e, { size }) => {
        // Update the width and height based on the new size
        updatedWidth(size.width);
        updatedHeight(size.height);
    };

    // Drag 
    const [draggedState, setDraggedState] = useState(true)
    const handleDragStart = (data, index, event) => {
        setDraggedState(true)
    }
    const handleDragEnd = (data, index, e) => {
        console.log("Droped")
        const newPosition = "Update"
        removeThatIndex(index, position)


        // Call the updatePosition function passed from the file editor
        // updatePosition(index, newPosition);
        // console.log("event.currentTarget")
        // const newPosition = {
        //     x: data.lastX,
        //     y: data.lastY,
        // };

        // // Call the updatePosition function passed from the file editor
        // updatePosition(index, newPosition);
        // setDraggedState(false)

    };
    const handleClick = () => {
        setDraggedState(false);
    };
    return (
        <>
            <Draggable
                key={index}
                disabled={draggedState} // Disable dragging when the condition is not met
                // onStop={(e, data) => handleDragEnd(data, index, e)} // Handle drag end
                onStart={(e, data) => handleDragStart(data, index, e)} // Add this line
                onMouseDown={handleClick}
            >
                <ResizableBox
                    className="hover-div"
                    key={index}
                    width={position.width}
                    height={position.height}
                    minConstraints={[50, 50]} // Set minimum size constraints as needed
                    resizeHandles={["se", "ne", "nw", "sw"]}
                    onResize={handleResize}
                    style={{
                        position: 'relative',
                        backgroundColor: 'rgb(98 188 221 / 28%)',
                        textAlign: 'center',
                        padding: '10px'
                    }}

                    // Hover 
                    onMouseEnter={() => {
                        // Show the message when hovered
                        const messageDiv = document.querySelector('.messageDiv');
                        if (messageDiv) {
                            messageDiv.style.display = 'block';
                        }
                    }}

                    onMouseLeave={() => {
                        // Hide the message when not hovered
                        const messageDiv = document.querySelector('.messageDiv');
                        if (messageDiv) {
                            messageDiv.style.display = 'none';
                        }
                    }}
                >
                    {/* Drag  */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: -35,
                            right: -15,
                            zIndex: 2,
                        }}

                    >

                        <Tooltip title="Drag">
                            <IconButton size="small"
                                onMouseDown={() => {
                                    setDraggedState(false);
                                    console.log("Drag")
                                    removeThatIndex(index, position)
                                }}
                                style={{ backgroundColor: 'white', cursor: 'grab', border: '1px solid gray' }}>
                                <Iconify icon="fluent:drag-20-filled" color="black" />
                            </IconButton>
                        </Tooltip>

                    </div>
                    {/* Delete  */}
                    <div
                        style={{
                            position: 'absolute',
                            top: -45,
                            right: 1,
                            zIndex: 2,
                        }}
                    >

                        <Tooltip title="Delete">
                            <Button
                                onClick={() => {
                                    removeSelectedImage(index);
                                }} color="error"
                                style={{
                                    borderRadius: '50%',
                                    border: '1px solid lightGray'
                                }
                                }>
                                <Iconify icon="ic:outline-delete" />
                            </Button>
                        </Tooltip>
                    </div>
                    <Avatar

                        alt="Remy Sharp"
                        variant="square"
                        src={`${BASE_URL}${position.url}`}
                        style={{
                            width: `${position.width}px`,
                            height: `${position.height}px`,
                            // border: '1px solid lightGray',

                        }}
                    />

                </ResizableBox>
            </Draggable>
        </>
    );
}
// ------------------------------------------------------------------------------------
// ---------------------------------POSITION Date,Check Mark --------------------------------
// ------------------------------------------------------------------------------------
export function PositionDate({ position, text, index, updatedText, updatedWidth, updatedHeight, updatePosition, removeSelectedImage }) {
    const [editedText, setEditedText] = useState(text);
    const [edit, setEdit] = useState(true)
    const handleTextChange = (e) => {
        setEditedText(e.target.value)
        updatedText(e.target.value)

    }
    const handleTextBlur = () => {
        setEdit(false);
    };
    const handleResize = (e, { size }) => {
        // Update the width and height based on the new size
        updatedWidth(size.width);
        updatedHeight(size.height);
    };

    // Drag 
    const [draggedState, setDraggedState] = useState(true)
    const handleDragStart = (data, index, event) => {
        setDraggedState(true)
    }
    const handleDragEnd = (data, index, e) => {
        console.log("event.currentTarget")
        // const newPosition = {
        //     x: data.lastX,
        //     y: data.lastY,
        // };

        // // Call the updatePosition function passed from the file editor
        // updatePosition(index, newPosition);
        console.log("Droped")
        const newPosition = "Update"


        // Call the updatePosition function passed from the file editor
        updatePosition(index, newPosition);
        setDraggedState(false)

    };
    const [DragView, setDragView] = useState(false)
    return (
        <>
            <Draggable
                key={index}
                disabled={draggedState} // Disable dragging when the condition is not met
                onStop={(e, data) => handleDragEnd(data, index, e)} // Handle drag end
                onStart={(e, data) => handleDragStart(data, index, e)} // Add this line
            >
                <ResizableBox
                    className="hover-div"
                    key={index}
                    width={position.width}
                    height={position.height}
                    minConstraints={[50, 50]} // Set minimum size constraints as needed
                    resizeHandles={["se", "ne", "nw", "sw"]}
                    onResize={handleResize}
                    style={{
                        position: 'relative',
                        backgroundColor: 'rgb(98 188 221 / 28%)',
                        textAlign: 'center',
                        padding: '10px'
                    }}

                    // Hover 
                    onMouseEnter={() => {
                        // Show the message when hovered
                        const messageDiv = document.querySelector('.messageDiv');
                        if (messageDiv) {
                            messageDiv.style.display = 'block';
                        }

                    }}

                    onMouseLeave={() => {
                        // Hide the message when not hovered
                        const messageDiv = document.querySelector('.messageDiv');
                        if (messageDiv) {
                            messageDiv.style.display = 'none';
                        }

                    }}
                >
                    {/* Drag  */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: -35,
                            right: -15,
                            zIndex: 2,
                        }}

                    >

                        <Tooltip title="Drag">
                            <IconButton size="small"
                                onMouseDown={() => {
                                    setDraggedState(false);
                                }}
                                style={{ backgroundColor: 'white', cursor: 'grab', border: '1px solid gray' }}>
                                <Iconify icon="fluent:drag-20-filled" color="black" />
                            </IconButton>
                        </Tooltip>

                    </div>
                    {/* Delete  */}
                    <div
                        style={{
                            position: 'absolute',
                            top: -45,
                            right: 1,
                            zIndex: 2,
                        }}
                    >

                        <Tooltip title="Delete">
                            <Button
                                onClick={() => {
                                    removeSelectedImage(index);
                                }} color="error"
                                style={{
                                    borderRadius: '50%',
                                    border: '1px solid lightGray'
                                }
                                }>
                                <Iconify icon="ic:outline-delete" />
                            </Button>
                        </Tooltip>
                    </div>
                    {edit ? <>
                        <TextField
                            type="text"
                            value={editedText}
                            onChange={handleTextChange}
                            onBlur={handleTextBlur}
                            style={{
                                fontSize: `${position.fontSize}px`,
                                color: position.color,
                                fontFamily: position.fontFamily,

                                padding: '3px',
                                border: 'none',
                                height: position.height,
                                width: 'auto'
                            }}
                            // autoFocus={`${position.text.length===0?"false":"true"}`}
                            size='small'
                            variant='standard'
                        />
                    </> :
                        <>
                            <Typography
                                onClick={() => setEdit(true)}
                                style={{
                                    fontSize: `${position.fontSize}px`,
                                    color: position.color,
                                    fontFamily: position.fontFamily,
                                    cursor: 'pointer',
                                    flexWrap: "wrap",
                                    whiteSpace: 'normal',
                                    border: 'none'
                                }}
                            >
                                {position.text}
                            </Typography>
                        </>}

                </ResizableBox>
            </Draggable>
        </>
    );
}
// ------------------------------------------------------------------------------------
// ---------------------------------POSITION Highlight --------------------------------
// ------------------------------------------------------------------------------------
export function PositionHighlight({ position, text, index, updatedText, updatedWidth, updatedHeight, updatePosition, removeSelectedImage }) {
    const [editedText, setEditedText] = useState(text);
    const [edit, setEdit] = useState(true)
    const handleTextChange = (e) => {
        setEditedText(e.target.value)
        updatedText(e.target.value)

    }
    const handleTextBlur = () => {
        setEdit(false);
    };
    const handleResize = (e, { size }) => {
        // Update the width and height based on the new size
        updatedWidth(size.width);
        updatedHeight(size.height);
    };

    // Drag 
    const [draggedState, setDraggedState] = useState(true)
    const handleDragStart = (data, index, event) => {
        setDraggedState(true)
    }
    const handleDragEnd = (data, index, e) => {
        console.log("event.currentTarget")
        // const newPosition = {
        //     x: data.lastX,
        //     y: data.lastY,
        // };

        // // Call the updatePosition function passed from the file editor
        // updatePosition(index, newPosition);
        console.log("Droped")
        const newPosition = "Update"


        // Call the updatePosition function passed from the file editor
        updatePosition(index, newPosition);
        setDraggedState(false)

    };
    const [DragView, setDragView] = useState(false)
    return (
        <>
            <Draggable
                key={index}
                disabled={draggedState} // Disable dragging when the condition is not met
                onStop={(e, data) => handleDragEnd(data, index, e)} // Handle drag end
                onStart={(e, data) => handleDragStart(data, index, e)} // Add this line
            >
                <ResizableBox
                    className="hover-div"
                    key={index}
                    width={position.width}
                    height={position.height}
                    minConstraints={[50, 50]} // Set minimum size constraints as needed
                    resizeHandles={["se", "ne", "nw", "sw"]}
                    onResize={handleResize}
                    style={{
                        position: 'relative',
                        // backgroundColor: 'rgb(98 188 221 / 28%)',
                        textAlign: 'center',
                        padding: '10px'
                    }}

                    // Hover 
                    onMouseEnter={() => {
                        // Show the message when hovered
                        const messageDiv = document.querySelector('.messageDiv');
                        if (messageDiv) {
                            messageDiv.style.display = 'block';
                        }

                    }}

                    onMouseLeave={() => {
                        // Hide the message when not hovered
                        const messageDiv = document.querySelector('.messageDiv');
                        if (messageDiv) {
                            messageDiv.style.display = 'none';
                        }

                    }}
                >
                    {/* Drag  */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: -35,
                            right: -15,
                            zIndex: 2,
                        }}

                    >

                        <Tooltip title="Drag">
                            <IconButton size="small"
                                onMouseDown={() => {
                                    setDraggedState(false);
                                }}
                                style={{ backgroundColor: 'white', cursor: 'grab', border: '1px solid gray' }}>
                                <Iconify icon="fluent:drag-20-filled" color="black" />
                            </IconButton>
                        </Tooltip>

                    </div>
                    {/* Delete  */}
                    <div
                        style={{
                            position: 'absolute',
                            top: -45,
                            right: 1,
                            zIndex: 2,
                        }}
                    >

                        <Tooltip title="Delete">
                            <Button
                                onClick={() => {
                                    removeSelectedImage(index);
                                }} color="error"
                                style={{
                                    borderRadius: '50%',
                                    border: '1px solid lightGray'
                                }
                                }>
                                <Iconify icon="ic:outline-delete" />
                            </Button>
                        </Tooltip>
                    </div>
                    {edit ? <>
                        {/* <TextField
                            type="text"
                            value={editedText}
                            onChange={handleTextChange}
                            onBlur={handleTextBlur}
                            style={{
                                fontSize: `${position.fontSize}px`,
                                color: position.color,
                                fontFamily: position.fontFamily,

                                padding: '3px',
                                border: 'none',
                                height: position.height,
                                width: 'auto'
                            }}
                            // autoFocus={`${position.text.length===0?"false":"true"}`}
                            size='small'
                            variant='standard'
                        /> */}
                        <Box style={{
                            width: `100%`,
                            height: `100%`,
                            backgroundColor: 'red',
                            padding: '10px',
                            opacity: 0.6
                        }}></Box>
                    </> :
                        <>
                            {/* <Typography
                                onClick={() => setEdit(true)}
                                style={{
                                    fontSize: `${position.fontSize}px`,
                                    color: position.color,
                                    fontFamily: position.fontFamily,
                                    cursor: 'pointer',
                                    flexWrap: "wrap",
                                    whiteSpace: 'normal',
                                    border: 'none'
                                }}
                            >
                                {position.text}
                            </Typography> */}
                            <Box style={{
                                width: `100%`,
                                height: `100%`,
                                backgroundColor: 'red',
                                padding: '10px',
                                opacity: 0.6
                            }}>

                            </Box>
                        </>}

                </ResizableBox>
            </Draggable>
        </>
    );
}
// ------------------------------------------------------------------------------------
// ---------------------------------POSITION Stamp --------------------------------
// ------------------------------------------------------------------------------------
export function PositionStamp({ position, text, index, updatedText, updatedWidth, updatedHeight, updatePosition, removeSelectedImage }) {
    const [editedText, setEditedText] = useState(text);
    const [edit, setEdit] = useState(true)
    const handleTextChange = (e) => {
        setEditedText(e.target.value)
        updatedText(e.target.value)

    }
    const handleTextBlur = () => {
        setEdit(false);
    };
    const handleResize = (e, { size }) => {
        // Update the width and height based on the new size
        updatedWidth(size.width);
        updatedHeight(size.height);
    };

    // Drag 
    const [draggedState, setDraggedState] = useState(true)
    const handleDragStart = (data, index, event) => {
        setDraggedState(true)
    }
    const handleDragEnd = (data, index, e) => {
        // console.log("event.currentTarget")
        // const newPosition = {
        //     x: data.lastX,
        //     y: data.lastY,
        // };

        // // Call the updatePosition function passed from the file editor
        // updatePosition(index, newPosition);
        console.log("Droped")
        const newPosition = "Update"


        // Call the updatePosition function passed from the file editor
        updatePosition(index, newPosition);
        setDraggedState(false)

    };
    const [DragView, setDragView] = useState(false)
    return (
        <>
            <Draggable
                key={index}
                disabled={draggedState} // Disable dragging when the condition is not met
                onStop={(e, data) => handleDragEnd(data, index, e)} // Handle drag end
                onStart={(e, data) => handleDragStart(data, index, e)} // Add this line
            >
                <ResizableBox
                    className="hover-div"
                    key={index}
                    width={position.width}
                    height={position.height}
                    minConstraints={[50, 50]} // Set minimum size constraints as needed
                    resizeHandles={["se", "ne", "nw", "sw"]}
                    onResize={handleResize}
                    style={{
                        position: 'relative',
                        // backgroundColor: 'rgb(98 188 221 / 28%)',
                        textAlign: 'center',
                        padding: '10px'
                    }}

                    // Hover 
                    onMouseEnter={() => {
                        // Show the message when hovered
                        const messageDiv = document.querySelector('.messageDiv');
                        if (messageDiv) {
                            messageDiv.style.display = 'block';
                        }

                    }}

                    onMouseLeave={() => {
                        // Hide the message when not hovered
                        const messageDiv = document.querySelector('.messageDiv');
                        if (messageDiv) {
                            messageDiv.style.display = 'none';
                        }

                    }}
                >
                    {/* Drag  */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: -35,
                            right: -15,
                            zIndex: 2,
                        }}

                    >

                        <Tooltip title="Drag">
                            <IconButton size="small"
                                onMouseDown={() => {
                                    setDraggedState(false);
                                }}
                                style={{ backgroundColor: 'white', cursor: 'grab', border: '1px solid gray' }}>
                                <Iconify icon="fluent:drag-20-filled" color="black" />
                            </IconButton>
                        </Tooltip>

                    </div>
                    {/* Delete  */}
                    <div
                        style={{
                            position: 'absolute',
                            top: -45,
                            right: 1,
                            zIndex: 2,
                        }}
                    >

                        <Tooltip title="Delete">
                            <Button
                                onClick={() => {
                                    removeSelectedImage(index);
                                }} color="error"
                                style={{
                                    borderRadius: '50%',
                                    border: '1px solid lightGray'
                                }
                                }>
                                <Iconify icon="ic:outline-delete" />
                            </Button>
                        </Tooltip>
                    </div>
                    {edit ? <>

                        <Avatar
                            alt="Remy Sharp"
                            variant="square"
                            src={`${BASE_URL}${position.url}`}
                            style={{
                                filter: 'grayscale(100%)',
                                width: `${position.width}px`,
                                height: `${position.height}px`,
                            }}
                        />
                    </> :
                        <>
                            <Avatar
                                alt="Remy Sharp"
                                variant="square"
                                src={`${BASE_URL}${position.url}`}
                                style={{
                                    filter: 'grayscale(100%)',
                                    width: `${position.width}px`,
                                    height: `${position.height}px`,
                                }}
                            />
                        </>}

                </ResizableBox>
            </Draggable>
        </>
    );
}
