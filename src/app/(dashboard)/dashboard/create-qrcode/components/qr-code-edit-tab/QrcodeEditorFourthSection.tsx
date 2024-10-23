import { Add } from "@mui/icons-material";
import { Box, Modal } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../qr-code-state/hooks";
import { addSlotForQRCodeMetaSpinWheel, setBgColorOfQRCodeMetaSpinWheel, setTextColorOfQRCodeMetaSpinWheel } from "../../qr-code-state/qr-code-state";
import { ColorPicker } from "./QrcodeEditorFirstSection";
import SpinWheelSlotController from "./SpinWheelSlotController";
import { useDisclosure } from "@chakra-ui/react";
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import { configurations } from "@/app-configurations";
import { TransitionalComponent } from "./QrcodeEditor";
import AppSpinner from "@/components/AppSpinner";
import { SpinWheelOption } from "@/types";
import dynamic from "next/dynamic";
const Wheel = dynamic(() => import('react-custom-roulette').then(mod => mod.Wheel), { ssr: false });

function QrcodeEditorFourthSection({ handlerPrevious, handlerForward, isLoading }: TransitionalComponent) {
  
  const [prizeNumber, setPrizeNumber] = useState<number>(0);
  const { width, height } = useWindowSize();
  const [mustSpin, setMustSpin] = useState(false);
  const qrCodeState = useAppSelector(state => state.qrCode);
  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isExploding, setIsExploding] = useState(false);

  const hasWon = qrCodeState.meta.spinWheelData.options[prizeNumber].option.length;

  return ( 
    <div className="w-full max-w-[32rem] py-4">
      <div className="pb-4">
        <h2 className="text-2xl font-bold pb-1">Edit Your Spin Wheel Game</h2>
        <p className="text-slate-600">Customize the slots for a unique experience tailored to your preferences.</p>
      </div>
      <div className="spin-wheel-display rounded-lg border-2 p-8 flex flex-col items-center gap-2">
        <img src={
          typeof qrCodeState.meta.logoImg == "string" ?
          qrCodeState.meta.logoImg :
          qrCodeState.meta.logoImg ? URL.createObjectURL(qrCodeState.meta.logoImg) : configurations.userImg
        } className="w-auto h-[6rem]" />
        
        <Modal open={isOpen} onClose={onClose} disableAutoFocus>
          <>
            {hasWon && <Confetti
              recycle={false}
              width={width}
              height={height}
            />}
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className='p-6 sm:px-14 flex flex-col items-center gap-6 rounded-md w-[30rem] bg-slate-100'
                transition={{ type: "spring" }}
              >
                {hasWon ? 
                  <>
                    <h1 className='text-center text-2xl'>Congratulations!</h1>
                    <div className='text-center'>
                      You have won a prize in our spin wheel game:
                      <div className="font-bold text-2xl py-2">{qrCodeState.meta.spinWheelData.options[prizeNumber].option}</div>
                      Check your SMS for more information.
                    </div>
                  </>
                  : 
                  <>
                    <h1 className='text-center text-2xl'>Too Bad!</h1>
                    <p className='text-center'>
                      You didn't win this time, but don't get discouraged. Luck will be on your side next time.
                    </p>
                  </>
                }
                <button onClick={onClose} className="bg-primary-color rounded-full text-white px-6 p-4 font-bold">Close</button>
              </motion.div>
            </Box>
          </>
        </Modal>
        
        <Wheel
          fontSize={16}
          mustStartSpinning={mustSpin}
          onStopSpinning={() => {
            onOpen();
            setMustSpin(false);
            setIsExploding(true);
          }}
          prizeNumber={prizeNumber}
          data={qrCodeState.meta.spinWheelData.options.map((o: SpinWheelOption) => ({
            option: o.option,
            optionSize: o.size,
          }))}
          backgroundColors={qrCodeState.meta.spinWheelData.bgColors}
          textColors={qrCodeState.meta.spinWheelData.textColor}
        />
        
        <button onClick={() => {
          setMustSpin(true);
          setPrizeNumber(Math.floor(Math.random() * qrCodeState.meta.spinWheelData.options.length));
        }} className="bg-primary-color text-white font-bold p-4 text-lg rounded-full px-8">Test</button>
      </div>

      <div className="spin-wheel-editor py-4 flex flex-col gap-4">
        <div className="flex flex-col gap-5 bg-white p-4 rounded-lg border-2">
          <h2 className="text-4xl">Colors</h2>
          <div className="flex gap-4">
            <ColorPicker title="Color 1" color={qrCodeState.meta.spinWheelData.bgColors[0]} action={setBgColorOfQRCodeMetaSpinWheel} index={1}/>
            <ColorPicker title="Color 2" color={qrCodeState.meta.spinWheelData.bgColors[1]} action={setBgColorOfQRCodeMetaSpinWheel} index={2}/>
          </div>
          <ColorPicker title="Text Color" color={qrCodeState.meta.spinWheelData.textColor[0]} action={setTextColorOfQRCodeMetaSpinWheel}/>
        </div>

        <div className="flex flex-col gap-5 bg-white p-4 rounded-lg border-2">
          <div className="grid grid-cols-2 gap-4">
            {qrCodeState.meta.spinWheelData.options.map((o: SpinWheelOption, i: number) => (
              <SpinWheelSlotController key={i} i={i} option={o}/>
            ))}
          </div>
          <button onClick={() => dispatch(addSlotForQRCodeMetaSpinWheel())} className="bg-black text-white p-3 font-bold rounded-lg shadow-lg w-fit flex gap-1">
            <Add />Add a Slot
          </button>
        </div>

        <div className="flex flex-col gap-5 p-4 rounded-lg border-2">
          <div className="flex gap-2 self-center">
            <button onClick={handlerPrevious} className="outline-primary-color p-3 font-bold rounded-full text-primary-color self-center px-6 flex gap-2 outline">
              Previous
            </button>
            <button onClick={handlerForward} className="bg-primary-blue p-3 font-bold rounded-full text-white self-center px-6 flex gap-2 transition-all hover:bg-primary-blue-dark border-2 border-gray-500">
              <>{isLoading && <AppSpinner variant="LIGHT" size={25}/>}Finish</>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QrcodeEditorFourthSection;
