declare interface JCommand {}

declare class JSCommandWrapper implements JCommand {
    static createJCommand(command: CommandBase): JSCommandWrapper;
}

declare class JSSubsystemWrapper {
    baseObject: SubsystemBase;
    static registerSubsystem(subsystem: SubsystemBase): JSSubsystemWrapper;
    setDefaultCommand(command: JCommand)
}

declare interface CommandBase {
    addRequirements?: (requirements: JSSubsystemWrapper[]) => void
    initialize(): void;
    isFinished(): boolean;
    execute(): void;
    end(interrupted: boolean): void;
    setRequirements(): void;
}

declare interface SubsystemBase {
    wrapper?: JSSubsystemWrapper;
    subsysInit(wrapper: JSSubsystemWrapper): void;
    periodic(): void;
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
    static fromMotorController(motor: MotorController): WPI_TalonFX
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

declare class Translation2d {
    constructor(x: number, y: number);

    getX(): number;
    getY(): number;
}

declare class SwerveModuleState {
    angle: Rotation2d;
    speedMetersPerSecond: number;
    static optimize(desiredState: SwerveModuleState, currentAngle: any): SwerveModuleState;

}

declare class SwerveDriveKinematics {
    static desaturateWheelSpeeds(moduleStates: SwerveModuleState[], attainableMaxSpeedMetersPerSecond: number);
    constructor(...wheelsMeters: Translation2d[])
    toSwerveModuleStates(chassisSpeeds: ChassisSpeeds): SwerveModuleState[];
}

declare class MotorController {
    
}

declare class SwerveModule {
    getPosition(): SwerveModulePosition;
    getSteerMotor(): MotorController;
    getDriveMotor(): MotorController;
    set(driveVoltage: number, steerAngle: number);
}

declare class ChassisSpeeds {
    vxMetersPerSecond: number;
    vyMetersPerSecond: number;
    omegaRadiansPerSecond: number;
    constructor(vxMetersPerSecond: number, vyMetersPerSecond: number, omegaRadiansPerSecond: number);
    constructor();
}

declare class MkModuleConfiguration {
    static getDefaultSteerFalcon500(): MkModuleConfiguration;
    setDriveCurrentLimit(driveCurrentLimit: number);
    setSteerCurrentLimit(steerCurrentLimit: number);
}

declare class MechanicalConfiguration {
    
}

declare class SdsModuleConfigurations {
    static MK4_L2: MechanicalConfiguration;
}

declare class MkSwerveModuleBuilder {
    constructor(configuration: MkModuleConfiguration);
    withGearRatio(mechConfig: MechanicalConfiguration): MkSwerveModuleBuilder;
    withDriveMotor(motorType: MotorType, motorPort: number, motorCanbus: String): MkSwerveModuleBuilder;
    withSteerMotor(motorType: MotorType, motorPort: number, motorCanbus: String): MkSwerveModuleBuilder;
    withSteerEncoderPort(encoderPort: number, canbus: String): MkSwerveModuleBuilder;
    withSteerOffset(offset: number): MkSwerveModuleBuilder;
    build(): SwerveModule;
}

declare enum MotorType {
    FALCON, NEO
}

declare class Rotation2d {
    getRadians(): number;
}

declare class SwerveModulePosition {
    angle: Rotation2d;
}

declare class WPI_TalonFX extends MotorController {
    
}