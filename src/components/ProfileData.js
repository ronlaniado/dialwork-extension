import React, { useState } from "react";
import "./ProfileData.css";

function ProfileData(props) {
	const [editing, setEditing] = useState(false);

	function copyToClipboard() {
		navigator.clipboard.writeText(props.value);
	}
	if (!editing) {
		return (
			<div className="data-container">
				<div className="data">
					<div>{props.value}</div>
					<div>{props.name}</div>
				</div>
				<div className="icon-container">
					<img className="icon edit-icon" src="../assets/icons/edit-solid.svg" alt="Edit" onClick={() => setEditing(true)} />
					<img className="icon clipboard-icon" src="../assets/icons/clipboard-solid.svg" alt="Copy" onClick={copyToClipboard} />
				</div>
			</div>
		);
	} else {
		return (
			<div className="editing-container">
				<div>Editing</div>
				<input defaultValue={props.name} placeholder="Title"></input>
				<input defaultValue={props.value} placeholder="Value"></input>
				<input></input>
				<button>Save</button>
				<button onClick={() => setEditing(false)}>Discard</button>
			</div>
		);
	}
}

export default ProfileData;
