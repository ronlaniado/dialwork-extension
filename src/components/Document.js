import React from "react";
import "./Document.css";

function Document(props) {
	return (
		<div>
			<div className="title" id="resumeText">
				{props.title}
			</div>
			<div className="icon-container">
				<img className="icon edit-icon" src="../assets/icons/edit-solid.svg" alt="Edit" />
				<a href={props.src} download>
					<img className="icon download-icon" src="../assets/icons/download-solid.svg" alt="Download" />
				</a>
			</div>
		</div>
	);
}

export default Document;
