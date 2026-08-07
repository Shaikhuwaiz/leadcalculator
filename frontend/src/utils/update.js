const seedUpdates = [ 

 
 
  {
    date: "03-08-2026 , Mon 10:26 PM",
    content: `Hi Lionel,

I wanted to share an update that your team will be seeing during
Order Entry specifically but possibly at other stages as needed. 


 


NetSuite Blackout Dates
Workflow Update


Update


A new workflow has been implemented in NetSuite to prevent sales orders from being saved with ship dates that fall on weekends (Saturday/Sunday) or holidays on Imperial's blackout list.
If a weekend or blackout holiday date is selected, NetSuite will automatically move the ship date to the next business day when the order is saved.
The holiday blacklist is maintained by Zor.


Purpose


This change is intended to eliminate the need for manual ship date cleanup around weekends and holiday closures.


CSR Takeaway


Be aware that NetSuite may automatically adjust ship dates when a weekend or blackout holiday is selected.
Manualcorrection of these dates should no longer be necessary.

Please let me know if you have any questions or concerns.

Thank you,
Jessica`
  },

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  {
    date: "01-08-2026 , Sat 1:18 AM",
    content: `I received confirmation from the other CSMs and we agree on the
below. I wanted to note that we had provided the previous instruction based on the stock issues we were experiencing within NetSuite at the time. This is no longer an issue and should be able to proceed with today's update without delays for our customers.

NetSuite should be defaulting to Ship Complete and should only
require a manual update per any special instructions/comments.


Please update the Back Order Policy regarding ship date type as follows with updates in RED:


Here are the specific guidelines:

• Event / Fast Lane orders: Ship Complete

• Tournament orders: Ship Complete

• Prebooks: Ship Complete

• Back orders: Ship Complete


•At Once Ship Dates (current lead time): Ship Complete 


Note: If the Order Copy Special Instructions or Task Comments specifically says to use Ship and Back Order vs Ship Complete, this is when you make that change. 

Please let me know if you have any questions. 

Thank you,
Jessica`
  },
];

export default seedUpdates;
