import React from 'react';
import { CustomButton } from './CustomButton';
import { useStateContext } from '../context/StateContext';

const WithdrawRequestCard = ({ request }) => {
  const { address, contract } = useStateContext();

  const handleVote = async (reqId) => {
    try {
      await contract.call('voteWithdrawRequest', reqId, { from: address });
      console.log('Vote successful');
    } catch (error) {
      console.log('Vote failed', error);
    }
  };

  const handleWithdraw = async (reqId, amount) => {
    try {
      await contract.call('withdrawRequestedAmount', reqId, { from: address });
      console.log('Withdrawal successful');
    } catch (error) {
      console.log('Withdrawal failed', error);
    }
  };

  return (
    <div>
      <h3>Withdraw Request #{request.requestId}</h3>
      <p>Description: {request.description}</p>
      <p>Amount: {request.amount}</p>
      <p>Recipient: {request.recipient}</p>
      <p>Status: {request.status}</p>
      {request.status === 'Pending' && (
        <div>
          <CustomButton onClick={() => handleVote(request.requestId)}>Vote</CustomButton>
        </div>
      )}
      {request.status === 'Approved' && (
        <div>
          <CustomButton onClick={() => handleWithdraw(request.requestId, request.amount)}>Withdraw</CustomButton>
        </div>
      )}
    </div>
  );
};

export default WithdrawRequestCard;