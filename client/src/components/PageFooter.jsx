import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";

const PageFooter = () => {
  const [activePopup, setActivePopup] = useState(null);

  const contentMap = {
    privacy: {
      title: 'Privacy Policy',
      content: 'OUR EXCHANGE is committed to protecting your personal information. This Privacy Policy lets you know what information we collect when you use our services, why we collect this information and how we use the collected information.',
      content2: 'Please note that this Privacy Policy will be agreed between you and OUR EXCHANGE. (‘We’, ‘Us’ or ‘Our’, as appropriate). This Privacy Policy is an integrated part of OUR EXCHANGE’s Terms and Conditions. We may periodically make changes to this Privacy Policy and will notify you of these changes by posting the modified terms on our platforms. We recommend that you revisit this Privacy Policy regularly.',
    },
    kyc: {
      title: 'KYC',
      content: 'To maintain the highest level of security, we require all our members to provide us with certain documentation in order to validate their accounts.',
      content2: 'The site OUR EXCHANGE and all of its original content are the sole property of ‘UNIVERSE Infotech Limited’ and are, as such, fully protected by International Copyright and other intellectual property rights laws. Any form of ‘Passing of funds’, ‘Self Matching’ will not be tolerated on OUR EXCHANGE. Any users found participating in such activites will be locked with the funds being reversed. Accounts participating in such activities must note that OUR EXCHANGE reserves the right to Void any bets of such nature at any time within 1 week of the bet being placed.'
    },
    terms: {
      title: 'Terms & Conditions',
      content: 'All OUR EXCHANGE users including ‘Super’, ‘Master’ and ‘Sub’ account holders are advised to read the following ‘Terms and Conditions’. All users who use OUR EXCHANGE agree and accept to the following:',
      content2: 'The site OUR EXCHANGE and all of its original content are the sole property of ‘UNIVERSE Infotech Limited’ and are, as such, fully protected by International Copyright and other intellectual property rights laws. Any form of ‘Passing of funds’, ‘Self Matching’ will not be tolerated on OUR EXCHANGE. Any users found participating in such activites will be locked with the funds being reversed. Accounts participating in such activities must note that OUR EXCHANGE reserves the right to Void any bets of such nature at any time within 1 week of the bet being placed.'    },
    rules: {
      title: 'Rules & Regulations',
      content: 'All OUR EXCHANGE users including ‘Super’, ‘Master’ and ‘Sub’ account holders are advised to read the following ‘Terms and Conditions’. All users who use OUR EXCHANGE agree and accept to the following:',
      content2: 'The site OUR EXCHANGE and all of its original content are the sole property of ‘UNIVERSE Infotech Limited’ and are, as such, fully protected by International Copyright and other intellectual property rights laws. Any form of ‘Passing of funds’, ‘Self Matching’ will not be tolerated on OUR EXCHANGE. Any users found participating in such activites will be locked with the funds being reversed. Accounts participating in such activities must note that OUR EXCHANGE reserves the right to Void any bets of such nature at any time within 1 week of the bet being placed.'    },
    gambling: {
      title: 'Responsible Gambling',
      content: 'All OUR EXCHANGE users including ‘Super’, ‘Master’ and ‘Sub’ account holders are advised to read the following ‘Terms and Conditions’. All users who use OUR EXCHANGE agree and accept to the following:',
      content2: 'The site OUR EXCHANGE and all of its original content are the sole property of ‘UNIVERSE Infotech Limited’ and are, as such, fully protected by International Copyright and other intellectual property rights laws. Any form of ‘Passing of funds’, ‘Self Matching’ will not be tolerated on OUR EXCHANGE. Any users found participating in such activites will be locked with the funds being reversed. Accounts participating in such activities must note that OUR EXCHANGE reserves the right to Void any bets of such nature at any time within 1 week of the bet being placed.'    }
  };

  const handleItemClick = (item) => {
    setActivePopup(item);
  };

  const closePopup = () => {
    setActivePopup(null);
  };

  return (
    <div className='p-4 pb-20 md:pb-4 relative'>
      <hr className='text-black mb-3'/>
      <div className='flex flex-wrap justify-center text-sm gap-2 text-black text-center w-full'>
        {Object.entries(contentMap).map(([key, { title }]) => (
          <button 
            key={key}
            className='hover:text-blue-600 focus:outline-none'
            onClick={() => handleItemClick(key)}
          >
            {title} {key !== 'gambling' && '|'}
          </button>
        ))}
      </div>

      {/* Popup Modal */}
      {activePopup && (
        <div className="fixed inset-0 bg-[#00000071] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
               className="bg-white rounded-sm max-w-2xl w-full h-[70vh] overflow-y-auto">
            <div className="p-4 md:p-6 flex flex-col justify-between gap-2 h-full">
              <div className="flex justify-center items-center mb-4">
                <h3 className="text-base font-bold text-black">{contentMap[activePopup].title}</h3>
              </div>
              <div>
              <div className="prose text-black text-sm">
                <p>{contentMap[activePopup].content}</p>
              </div>
              <div className="prose text-black text-sm">
                <p>{contentMap[activePopup].content2}</p>
              </div>
              </div>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={closePopup}
                  className="px-4 py-1 text-sm bg-[white] text-black rounded border"
                >
                  OK
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PageFooter;