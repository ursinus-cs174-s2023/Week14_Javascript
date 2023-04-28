
/**
 * Class for selecting a discrete loop in 2D
 */
class LoopCurve {
    constructor() {
        this.Ps = []; 
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext("2d"); //For drawing
        ctx.font = "16px Arial";
        this.ctx = ctx;
        //Need this to disable that annoying menu that pops up on right click
        canvas.addEventListener("contextmenu", function(e){ e.stopPropagation(); e.preventDefault(); return false; }); 
        this.canvas = canvas;
        this.canvas.addEventListener("mousedown", this.selectPoint.bind(this));
        this.canvas.addEventListener("touchstart", this.selectPoint.bind(this)); //Works on mobile devices!
    
        this.keysDown = {87:false, 83:false, 65:false, 68:false};
        document.addEventListener('keydown', this.keyDown.bind(this), true);
        document.addEventListener('keyup', this.keyUp.bind(this), true);
    }

    /**
     * Redraw arm based on positions
     */
     repaint(clearRect) {
        const ctx = this.ctx;
        const canvas = this.canvas;
        const dW = 1;
        const W = canvas.width;
        const H = canvas.height;
        const Ps = this.Ps;
        if (clearRect || clearRect === undefined) {
            ctx.clearRect(0, 0, W, H);
        }
        
        //Draw joints
        for (let i = 0; i < Ps.length; i++) {
            ctx.fillStyle = "#000000";
            ctx.fillRect(Ps[i][0]-dW, H-(Ps[i][1]+dW), dW*2+1, dW*2+1);
        }
        
        //Draw body
        ctx.fillStyle = "#000000";
        for (let i = 0; i < Ps.length; i++) {
            ctx.beginPath();
            ctx.moveTo(Ps[i][0], H-Ps[i][1]);
            ctx.lineTo(Ps[(i+1)%Ps.length][0], H-Ps[(i+1)%Ps.length][1]);
            ctx.stroke();
        }
    }

    getMousePos(evt) {
        let rect = this.canvas.getBoundingClientRect();
        return {
            X: evt.clientX - rect.left,
            Y: evt.clientY - rect.top
        };
    }

    selectPoint(evt) {
        let mousePos = this.getMousePos(evt);
        let X = mousePos.X;
        let Y = this.canvas.height - mousePos.Y;
        let clickType = "LEFT";
        evt.preventDefault();
        if (evt.which) {
            if (evt.which == 3) clickType = "RIGHT";
            if (evt.which == 2) clickType = "MIDDLE";
        }
        else if (evt.button) {
            if (evt.button == 2) clickType = "RIGHT";
            if (evt.button == 4) clickType = "MIDDLE";
        }
        
        if (clickType == "LEFT") {
            this.Ps.push([X, Y]);
        }
        else {
            //Remove point
            if (this.Ps.length > 0) {
                this.Ps.pop();
            }
            else {
                this.startJoint = null;
            }
        }
        this.repaint();
    }


    /////////////////////////////////////////////////////
    //             KEYBOARD CALLBACKS                  //
    /////////////////////////////////////////////////////

    /**
     * React to a key being pressed
     * @param {keyboard callback} evt 
     */
    keyDown(evt) {
        if (!this.active) {
            return;
        }
        let newKeyDown = false;
        if (evt.keyCode == 87) { //W
            if (!this.keysDown[87]) {
                newKeyDown = true;
                this.keysDown[87] = true;
                this.movefb = 1;
            }
        }
        else if (evt.keyCode == 83) { //S
            if (!this.keysDown[83]) {
                newKeyDown = true;
                this.keysDown[83] = true;
                this.movefb = -1;
            }
        }
        else if (evt.keyCode == 65) { //A
            if (!this.keysDown[65]) {
                newKeyDown = true;
                this.keysDown[65] = true;
                this.movelr = -1;
            }
        }
        else if (evt.keyCode == 68) { //D
            if (!this.keysDown[68]) {
                newKeyDown = true;
                this.keysDown[68] = true;
                this.movelr = 1;
            }
        }
    }
    
    /**
     * React to a key being released
     * @param {keyboard callback} evt 
     */
    keyUp(evt) {
        if (!this.active) {
            return;
        }
        if (evt.keyCode == 87) { //W
            this.movefb = 0;
            this.keysDown[87] = false;
        }
        else if (evt.keyCode == 83) { //S
            this.movefb = 0;
            this.keysDown[83] = false;
        }
        else if (evt.keyCode == 65) { //A
            this.movelr = 0;
            this.keysDown[65] = false;
        }
        else if (evt.keyCode == 68) { //D
            this.movelr = 0;
            this.keysDown[68] = false;
        }
    }  

}

