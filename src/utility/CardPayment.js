import React, { useEffect, useState } from 'react';
import { Delete, Trash2 } from 'react-feather';
import { Button, Modal, ModalFooter, ModalHeader, Spinner } from 'reactstrap';
import { authDelete, authGet, authPost, put } from '../urls/api';

function CardPayment({ paymentModal, setPaymentModal, amount, session }) {
  // State variables for form inputs
  const [data, setData] = useState({});
  const [update, setUpdate] = useState(false);
  const [error, setError] = useState('');
  const [cardDetail, setCardDetail] = useState({});
  const [loading, setLoading] = useState(false);
  const togglePaymentModal = () => {
    setPaymentModal(!paymentModal);
  };
  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted!');
  };

  const handleChange = (e) => {
    setCardDetail({ ...cardDetail, [e.target.name]: e.target.value });
  };
  const addCard = (event) => {
    event.preventDefault();
    setLoading(true);
    const postData = {
      ...cardDetail,
      exp_month: cardDetail.date?.split('/')[0],
      exp_year: cardDetail.date?.split('/')[1],
    };

    console.log(postData)

    authPost('stripe/add-card', postData)
      .then((res) => {
        if (res?.success) {
          setCardDetail({ ...cardDetail, number: '', date: '', cvv: '' });
          setUpdate(!update);
        } else {
          console.log(res.msg);
          setError(res?.msg);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log('error:>', err);
      });
  };

  const deleteCard = (id) => {
    setLoading(true);
    authDelete(`stripe/card/delete/${id}`).then((res) => {
      if (res?.success) {
        setUpdate(!update);
        setLoading(false);
      }
    });
  };

  const payment = (id) => {
    setLoading(true);
    authPost(`stripe/payment/${id}`, { charges: amount }).then((res) => {
      put(`session/payment-status/${session}`, {
        // status: 'paid',
      }).then((res) => {
        setLoading(false);
      });
    });
  };

  useEffect(() => {
    // setLoading(true);
    // authGet('stripe/card/get').then((res) => {
    //   // console.log(res?.cards)
    //   if (!res?.cards?.customer_id) {
    //     authPost('stripe/creates/customer').then((result) => {
    //       setData({ ...result.update, cardlist: [] });
    //       setLoading(false);
    //     });
    //   } else {
    //     setData(res.cards);
    //     setLoading(false);
    //   }
    // });
  }, [update]);

  return (
    <Modal
      style={{ marginTop: '5%' }}
      isOpen={paymentModal}
      toggle={togglePaymentModal}
      
    >
      <div className='row d-flex justify-content-center'>
        <div>
          <div>
            <div className='card-body p-2'>
              <ModalHeader
                toggle={togglePaymentModal}
                className='text-center mb-2'
              >
                {' '}
                <h6>Payment</h6>
              </ModalHeader>
              <form onSubmit={handleSubmit}>
                {console.log(data)}
                <p className='fw-bold mb-0 pb-0'>Saved cards:</p>
                {data?.cardlist?.length === 0 && (
                  <p className='p-2' style={{ fontSize: '12px' }}>
                    No Saved Card
                  </p>
                )}
                {data?.cardlist?.map((card, index) => (
                  <div
                    key={card.id}
                    className='d-flex flex-row align-items-center mb-0 pb-0'
                  >
                    <img
                      className='img-fluid'
                      src={`https://img.icons8.com/color/38/000000/${card.type.toLowerCase()}.png`}
                      alt={card.type}
                    />
                    <div
                      className='flex-fill mx-3 pt-1'
                      style={{ width: '30px', overflow: 'hidden' }}
                    >
                      <p>{`**** **** **** ${card.last4}`}</p>
                    </div>
                    <Button
                      onClick={() => payment(card.id)}
                      color='primary'
                      size='sm'
                      style={{ fontSize: '12px' }}
                    >
                      Pay
                    </Button>
                    <Button
                      onClick={() => deleteCard(card.id)}
                      style={{
                        marginLeft: '10px',
                        // fontSize: '10px',
                        padding: '4px',
                      }}
                      color='danger'
                      size='sm'
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                ))}
                <p className='fw-bold mb-1'>Add new card:</p>
                <div className='row mb-2'>
                  <div className='col-12'>
                    <div className='form-outline'>
                      <input
                        type='number'
                        name='number'
                        className='form-control form-control-lg'
                        value={cardDetail?.number}
                        onChange={handleChange}
                      />
                      <label className='form-label'>Card Number</label>
                    </div>
                  </div>
                  <div className='col-4'>
                    <div className='form-outline'>
                      <input
                        type='text'
                        className='form-control form-control-lg'
                        name='date'
                        value={cardDetail?.date}
                        onChange={handleChange}
                        placeholder='MM/YYYY'
                      />
                      <label className='form-label'>Expire</label>
                    </div>
                  </div>
                  <div className='col-3'>
                    <div className='form-outline'>
                      <input
                        type='text'
                        className='form-control form-control-lg'
                        name='cvv'
                        value={cardDetail?.cvv}
                        onChange={handleChange}
                        placeholder='CVV'
                      />
                      <label className='form-label'>CVV</label>
                    </div>
                  </div>
                </div>
                <p style={{ color: 'red' }}>{error}</p>

                <Button
                  block
                  // disabled={loading}
                  onClick={addCard}
                  color='primary'
                  className='justify-content-center w-50'
                  style={{ borderRadius: '25px' }}
                >
                  {/* {loading ? (
                    <Spinner size='sm'>Loading...</Spinner>
                  ) : ( */}
                    Add card
                  {/* )} */}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default CardPayment;
