"use client";
import { Check, Close, MoreVert } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../qr-code-state/hooks";
import { useEffect, useRef, useState } from "react";
import { SpinWheelOption } from "@/types";
import { StyledEditableText } from "./ClientFormInstance";
import { removeOptionFromQRCodeMetaSpinWheel, setOptionTextOfQRCodeMetaSpinWheel } from "../../qr-code-state/qr-code-state";

function SpinWheelSlotController({ i, option }: { i: number, option: SpinWheelOption }) {

    const qrCodeState = useAppSelector(state => state.qrCode);
    const dispatch = useAppDispatch();
    const [modifyText, setModifytext] = useState(false);
    const paragraphRef = useRef<any>(null);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (modifyText && paragraphRef.current) {
            paragraphRef.current.focus();
        }
    }, [modifyText]);

    return (
        <div key={i} className="flex flex-col gap-1">
            <label className="font-bold">Slot {i + 1} {!qrCodeState.meta.spinWheelData.options[i].option ? "(empty)" : ""}</label>
            <div className="bg-[#c7c7c7]/25 shadow-lg rounded-lg px-2 py-1 font-bold flex justify-between items-center">
                <div className="grow">
                    <StyledEditableText
                        ref={paragraphRef}
                        contentEditable={modifyText}>{option.option}</StyledEditableText>
                    <p className="text-xs text-slate-600"></p>
                </div>
                {!modifyText && <IconButton
                    id="option-menu-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                ><MoreVert /></IconButton>}
                <Menu
                    id="option-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={() => {
                        setModifytext(true);
                        handleClose();
                    }}>Edit Text</MenuItem>
                    {qrCodeState.meta.spinWheelData.options.length > 1 && <MenuItem onClick={() => {
                        dispatch(removeOptionFromQRCodeMetaSpinWheel(i));
                        handleClose();
                    }}>Delete</MenuItem>}
                </Menu>
            </div>
            {modifyText && (
                <div className="flex gap-2 m-1 items-center">
                    <button
                        className="rounded-full hover:bg-green-500 hover:text-white transition-all py-1 px-[0.35rem] h-fit"
                        onClick={() => {
                            setModifytext(false);
                            dispatch(setOptionTextOfQRCodeMetaSpinWheel([i, paragraphRef.current.innerText]));
                        }}
                    >
                        <Check />
                    </button>
                    <button
                        className="rounded-full hover:bg-red-500 hover:text-white transition-all py-1 px-[0.35rem] h-fit"
                        onClick={() => {
                            setModifytext(false);
                            paragraphRef.current.innerText = qrCodeState.meta.spinWheelData.options[i].option;
                        }}
                    >
                        <Close />
                    </button>
                </div>
            )}
        </div>
    );
}

export default SpinWheelSlotController;
