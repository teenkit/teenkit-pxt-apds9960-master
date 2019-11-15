/**
 * makecode APDS9960 Gesture Sensor Package.
 */

/**
 * APDS9960 block
 */
//% weight=10 color=#800080 icon="\uf017" block="rx8035"
namespace apds9960 {
    let I2C_ADDR = 0x39
    let APDS9960_ID = 0xab
    let REG_ID = 0x92
    let REG_UP = 0xfc
    let REG_DOWN = 0xfd
    let REG_LEFT = 0xfe
    let REG_RIGHT = 0xff

    let DATA_U, DATA_D, DATA_L, DATA_R;
    let OLD_U, OLD_D, OLD_L, OLD_R;
    let work;
    let U_PEAK_END_FLAG, D_PEAK_END_FLAG, L_PEAK_END_FLAG, R_PEAK_END_FLAG;
    let STATUS_UD, STATUS_LR;
    let OLD_STATUS_UD, OLD_STATUS_LR;
    let DISP_FLAG;
    let NOISE_LEVEL = 2;
    let DECIDE_FLAG;
    let PHASE_COUNTER;
    let U_PEAK, D_PEAK, L_PEAK, R_PEAK;

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

    /**
     * get RTC DATA
     */
    //% blockId="init" block="init"
    //% weight=90 blockGap=8
export function init():boolean{
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
    /**
     * set Date and Time
     * @param year data of year, eg: 2019
     * @param month data of month, eg: 3
     * @param day data of day, eg: 14
     * @param weekday data of weekday, eg: 4
     * @param hour data of hour, eg: 5
     * @param minute data of minute, eg: 30
     * @param second data of second, eg: 0
     */
    //% blockId="setSecond" block="set second %dat"
    //% weight=70 blockGap=8
    //% blockId="setDateTime" block="set year %year|month %month|day %day|weekday %weekday|hour %hour|minute %minute|second %second"
    export function DateTime(year: number, month: number, day: number, weekday: number, hour: number, minute: number, second: number): void {
        let buf = pins.createBuffer(8);
        pins.i2cWriteBuffer(I2C_ADDR, buf)
    }
    /**
     * get RTC DATA
     */
    //% blockId="getData" block="get RTC data"
    //% weight=68 blockGap=8
    export function getData(): number[] {
        let retbuf = [0, 0, 0, 0, 0, 0, 0]
        let buf = getRawData();
        return retbuf;
    }
    /**
     * get RTC RAW DATA
     */
    //% blockId="getRawData" block="get RTC RAW data"
    //% weight=46 blockGap=8
    export function getRawData(): number[] {
        let retbuf = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        let buf = pins.i2cReadBuffer(I2C_ADDR, 16);
        for (let i = 0; i < 16; i++) {
            retbuf[i] = buf[i]
        }
        return retbuf;
    }
    /**
     * Clear VDET
     */
    //% blockId="clearVdet" block="clear VDET"
    //% weight=44 blockGap=8
    export function clearVdet(): void {
    }
}
