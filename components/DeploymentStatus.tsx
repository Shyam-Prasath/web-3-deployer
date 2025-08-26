import React from "react";

function DeploymentStatus({ onClose }: { onClose: any }) {
  return (
    <div className="deployment-status">
      <p>Deployment Status</p>
      <p>Your content has been deployed successfully!</p>
      <button onClick={onClose}>Close</button>
      <button>Copy URL</button>
      <button>View Preview</button>
      <button>View Source Code</button>
    </div>
  );
}

export default DeploymentStatus;
