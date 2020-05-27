import React from "react";
import "./Tray.css";
import Document from "./components/Document";
import ProfileData from "./components/ProfileData";

function Tray() {
	return (
		<div className="Tray">
			<Document title={"Resume"} src={"../assets/documents/resume.pdf"} />
			<Document title={"Cover Letter"} src={"../assets/documents/cover-letter.pdf"} />
			<ProfileData name="Phone Number" value="(555)-555-5555" />
			<ProfileData name="Website" value="https://gatesnotes.com" />
			<ProfileData name="Address" value="1875 23rd Ave NE" />
		</div>
	);
}

export default Tray;
