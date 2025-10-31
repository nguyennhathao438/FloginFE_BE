import { HomeIcon } from "lucide-react";

export default function Header(){
    return(
        <div className="w-full bg-blue-600 shadow-md fixed top-0 left-0 z-50 ">
            <div className="flex justify-between items-center px-4 py-3 ">
                <div className="flex items-center gap-2">
                <HomeIcon className="h-10 w-10 text-white"/>
                <h1 className="text-3xl text-white">Trang chủ</h1>
                </div>
                <div>
                <img src="." className="rounded-full w-10 h-10 border-2 border-white object-cover"></img>
                </div>
            </div>
        </div>
    );
};