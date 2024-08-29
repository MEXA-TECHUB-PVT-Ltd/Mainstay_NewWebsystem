import { Button, Card, CardBody } from "reactstrap";
import IOSToggleButton from "../../../../utility/IOSToggleButton";

const notificationRows = [
  "App Updates",
  "Confirmation Messages",
  "Upcoming Session",
];

const NotificationSettings = () => {
  return (
    <>
      <Card style={{ display: "flex", flexDirection: "column" }}>
        <div className="py-2 px-2">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <h4 className="mb-0" style={{ color: "#0F6D6A" }}>Notification Settings</h4>
            <Button
              color="primary"
              style={{
                borderRadius: "50px",
                boxShadow: "none",
              }}
            >
              Edit
            </Button>
          </div>
        </div>
        <CardBody style={{ margin: "0"}}>
          <div className="row">
            <div className="col">
              {notificationRows.map((row, index) => (
                <div key={index}>
                  <h6 className="my-1">{row}</h6>
                </div>
              ))}
            </div>
            <div className="col" style={{ textAlign: "right" }}>
              {/* {Array.from({ length: notificationRows.length }).map((index) => (
                <div key={index}>
                  <IOSToggleButton
                  // defaultChecked={}
                  // handleChange={}
                  />
                </div>
              ))} */}
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};


export default NotificationSettings;
