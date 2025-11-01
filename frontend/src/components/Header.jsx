import { HomeIcon } from "lucide-react";
import "./Header.css"; // Import file CSS

export default function Header(){
    return(
        <div className="header-container">
            <div className="header-content">
                <div className="header-title-group">
                <HomeIcon className="home-icon"/>
                <h1 className="header-title">Trang chủ</h1>
                </div>
                <div>
                <img src="." alt="User Avatar" className="user-avatar"></img>
                </div>
            </div>
        </div>
    );
};