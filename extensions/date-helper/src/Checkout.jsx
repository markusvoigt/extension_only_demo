import React, {useState} from "react";
import {
  Banner,
  reactExtension,
  DateField,
  useApplyAttributeChange,
  useAppMetafields,
  useAttributes,
  useCustomer,
  useApplyNoteChange
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);


function Extension() {

  const customer = useCustomer();
  const changeOrderNote=useApplyNoteChange();
  const changeCheckoutAttributes=useApplyAttributeChange();
  

   // RETURNS THE METAFIELD ON THE CUSTOMER LEVEL
   const metafields = useAppMetafields();
   const metafieldEntry = metafields.find((entry) => entry.metafield.key=="dob");
   let customerDOBMetafield = (metafieldEntry) ? metafieldEntry.metafield : null;

   
  const [selectedDate, setSelectedDate] = useState(customerDOBMetafield?.value || "");
  const today = new Date(Date.now());
  const date = `${today.getMonth()+1}-${today.getDate()}`;

  const checkoutAttributes=useAttributes();


  if (checkoutAttributes.filter((entry)=>entry.key=="date").length==0){
   changeCheckoutAttributes({
    type: "updateAttribute",
    key: "date",
    value: date
  }); 
}
// SETS THE DOB AS AN ORDER NOTE. FLOW WILL TRANSFER IT TO A CUSTOMER METEFIELD AND DELETE THE ORDER NOTE
  const handleDateChange = (newSelectedDate) => {
    setSelectedDate(newSelectedDate);
      changeOrderNote({
        type: "updateNote",
        note: newSelectedDate
      })
  };


  if (customer && customerDOBMetafield==null) return (
    <Banner title="Tell us your birthday to get 10% on your special day!">
      <DateField label="Your date of birth" onChange={handleDateChange} value={selectedDate}
          />
    </Banner>
  )
  return <></>
}