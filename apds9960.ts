
//% weight=10 color=#9F79EE icon="\uf108" block="手势传感器"
namespace APDS9960{
	let I2C_ADDR = 0x39
    let APDS9960_ID = 0xab
    let REG_ID = 0x92
    let REG_UP = 0xfc
    let REG_DOWN = 0xfd
    let REG_LEFT = 0xfe
    let REG_RIGHT = 0xff
	
	 /**
     * set reg
     */
    function setReg(reg: number, dat: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = dat;
        pins.i2cWriteBuffer(I2C_ADDR, buf);
    }

    /**
     * get reg
     */
    function getReg(reg: number): number {
        pins.i2cWriteNumber(I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(I2C_ADDR, NumberFormat.UInt8BE);
    }
    
    //% blockId=gesture_init block="初始化|%gestures"
    export function init(){
    	let id=getReg(REG_ID)
        if(id!=APDS9960_ID) return false;
        setReg(0x80, 0b01000101); //POWER ON<0>, GESTURE ENABLE<6>, PROXIMITY DETECT ENALBE<2>,AEN=0
        setReg(0x90, 0b00110000); //Gesture LED Drive Strength 300%(max)
        setReg(0xA3, 0b01100100); //Reserve0, Gain x8(11), LED Drive 100mA(00), Wait Time see under number
        //111=39.2mS 110=30.8mS 101=22.4mS 100=14.0mS 011=8.4mS 010=5.6mS 001=2.8ms 000=0mS
        setReg(0xA4, 70);        //U MINUS OFFSET
        setReg(0xA5, 0);         //D MINUS OFFSET
        setReg(0xA7, 10);        //L MINUS OFFSET
        setReg(0xA9, 34);        //R MINUS OFFSET
        setReg(0xAB, 0b00000001); //GIEN off<1>(INTERRUPT DISABLE), GMODE ON<0>
        return true
    }
    
}
