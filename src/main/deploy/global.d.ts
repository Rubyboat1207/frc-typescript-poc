declare interface JCommand {}

declare class JSCommandWrapper implements JCommand {
    static createJCommand(command: CommandBase): JSCommandWrapper;
}

declare class JSSubsystemWrapper {
    subsystem: SubsystemBase;
    static registerSubsystem(subsystem: SubsystemBase): JSSubsystemWrapper;
}

declare interface CommandBase {
    addRequirements?: (requirements: JSSubsystemWrapper[]) => void;
    initialize(): void;
    isFinished(): boolean;
    execute(): void;
    end(interrupted: boolean): void;
}

declare interface SubsystemBase {
    wrapper?: JSSubsystemWrapper;
    subsysInit(wrapper: JSSubsystemWrapper): void;
}

declare class SmartDashboard {
    static putNumber(key: string, number: number): void;
    static putString(key: string, string: string): void;
}

declare interface Trigger {
    onTrue(command: JCommand): Trigger;
    whileTrue(command: JCommand): Trigger;
    toggleOnTrue(command: JCommand): Trigger;
    onFalse(command: JCommand): Trigger;
    whileFalse(command: JCommand): Trigger;
    toggleOnFalse(command: JCommand): Trigger;
}

declare class RobotUtil {
    static registerPeriodic(periodic: () => void);
}

declare class CommandXboxController{
    constructor(port: number);

    leftBumper(): Trigger;
    // leftBumper(loop: EventLoop): Trigger;

    rightBumper(): Trigger;
    // rightBumper(loop: EventLoop): Trigger;

    leftStick(): Trigger;
    // leftStick(loop: EventLoop): Trigger;

    rightStick(): Trigger;
    // rightStick(loop: EventLoop): Trigger;

    a(): Trigger;
    // a(loop: EventLoop): Trigger;

    b(): Trigger;
    // b(loop: EventLoop): Trigger;

    x(): Trigger;
    // x(loop: EventLoop): Trigger;

    y(): Trigger;
    // y(loop: EventLoop): Trigger;

    start(): Trigger;
    // start(loop: EventLoop): Trigger;

    back(): Trigger;
    // back(loop: EventLoop): Trigger;

    // leftTrigger(loop: EventLoop, threshold: number): Trigger;
    leftTrigger(threshold: number): Trigger;
    leftTrigger(): Trigger;

    // rightTrigger(threshold: number, loop: EventLoop): Trigger;
    rightTrigger(threshold: number): Trigger;
    rightTrigger(): Trigger;

    getLeftX(): number;
    getRightX(): number;
    getLeftY(): number;
    getRightY(): number;

    dPadUp(): Trigger;
    // dPadUp(loop: EventLoop): Trigger;

    dPadDown(): Trigger;
    // dPadDown(loop: EventLoop): Trigger;

    dPadLeft(): Trigger;
    // dPadLeft(loop: EventLoop): Trigger;

    dPadRight(): Trigger;
    // dPadRight(loop: EventLoop): Trigger;

    getDPadAngle(): number;

    // setRumble(type: RumbleType, value: number): void;
}

