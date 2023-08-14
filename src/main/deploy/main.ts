const copySign = (x, y) => Math.sign(x) === Math.sign(y) ? x : -x;

class RobotContainer {
    driver: CommandXboxController;
    systems: Systems;

    private static deadband(value: number, deadband: number): number {
        if (Math.abs(value) > deadband) {
            if (value > 0.0) {
                return (value - deadband) / (1.0 - deadband);
            } else {
                return (value + deadband) / (1.0 - deadband);
            }
        } else {
            return 0.0;
        }
    }


    static modifyAxis(value: number): number {
        // Deadband
        value = RobotContainer.deadband(value, 0.15);

        // More sensitive at smaller speeds
        let newValue = Math.pow(value, 2);

        // Copy the sign to the new value
        newValue = copySign(newValue, value);

        return newValue;
    }

    main() {
        this.systems = new Systems();
        this.systems.drivebase.setDefaultCommand(JSCommandWrapper.createJCommand(new DriveCommand(
            this.systems,
            () => {
                const inX = -this.driver.getLeftY(); // swap intended
                const inY = -this.driver.getLeftX();
                const mag = Math.hypot(inX, inY);
                const theta = Math.atan2(inY, inX);
                return {driverX: RobotContainer.modifyAxis(mag) * Drivebase.MAX_VELOCITY_METERS_PER_SECOND, driverY: theta};
            },
            //RobotContainer.modifyAxis(-this.driver.getRightX()) * Drivebase.MAX_ANGULAR_VELOCITY_RADIANS_PER_SECOND)))
            () => RobotContainer.modifyAxis(-this.driver.getRightX) * Drivebase.MAX_ANGULAR_VELOCITY_RADIANS_PER_SECOND
        )));

        this.driver = new CommandXboxController(0);

        
    }
}

type JoystickProvider = () => {driverX: number, driverY: number};

class DriveCommand implements CommandBase {
    addRequirements?: (requirements: JSSubsystemWrapper[]) => void
    getMove: JoystickProvider;
    getRotation: () => number;
    drivebase: Drivebase;
    requirements: JSSubsystemWrapper[];

    constructor(systems: Systems, getMove: JoystickProvider, getRotation: () => number) {
        this.getMove = getMove;
        this.getRotation = getRotation;
        this.drivebase = systems.getDrivebase();

        this.requirements = [systems.drivebase]
    }

    setRequirements(): void {
        this.addRequirements(this.requirements);
    }

    initialize(): void {
        console.log('Drive Starting!')
    }

    isFinished(): boolean {
        return false;
    }
    execute(): void {
        console.log('Drive')
        const move = this.getMove();
        console.log(this.drivebase);
        this.drivebase.drive(new ChassisSpeeds(move.driverX, move.driverY, this.getRotation()))
    }
    end(interrupted: boolean): void {
        this.drivebase.stop();
    }

}

class Drivebase implements SubsystemBase{
    static MAX_VOLTAGE = 12;
    static MAX_VELOCITY_METERS_PER_SECOND = 6380.0 / 60.0 *
    (14.0 / 50.0) * (27.0 / 17.0) * (15.0 / 45.0) *
    0.10033 * Math.PI;
    public static DRIVETRAIN_TRACKWIDTH_METERS = 0.546;
    public static DRIVETRAIN_WHEELBASE_METERS = 0.648;

    static FRONT_LEFT_MODULE_DRIVE_MOTOR = 2;
    static FRONT_LEFT_MODULE_STEER_MOTOR = 1;
    static FRONT_LEFT_MODULE_STEER_ENCODER = 9;
    static FRONT_LEFT_MODULE_STEER_OFFSET = -(291.888 * Math.PI / 180);
    public static CANBUS_DRIVETRAIN = "omnivore";

    public static  FRONT_RIGHT_MODULE_DRIVE_MOTOR = 8;
    public static  FRONT_RIGHT_MODULE_STEER_MOTOR = 7;
    public static  FRONT_RIGHT_MODULE_STEER_ENCODER = 12;
    public static FRONT_RIGHT_MODULE_STEER_OFFSET = -(103.975 * Math.PI / 180);

    public static  BACK_LEFT_MODULE_DRIVE_MOTOR = 4;
    public static  BACK_LEFT_MODULE_STEER_MOTOR = 3;
    public static  BACK_LEFT_MODULE_STEER_ENCODER = 10;
    public static BACK_LEFT_MODULE_STEER_OFFSET = -(110.654 * Math.PI / 180);

    public static  BACK_RIGHT_MODULE_DRIVE_MOTOR = 6;
    public static  BACK_RIGHT_MODULE_STEER_MOTOR = 5;
    public static  BACK_RIGHT_MODULE_STEER_ENCODER = 11;
    public static BACK_RIGHT_MODULE_STEER_OFFSET = -(52.910 * Math.PI / 180);


    public static MAX_ANGULAR_VELOCITY_RADIANS_PER_SECOND = Drivebase.MAX_VELOCITY_METERS_PER_SECOND /
    Math.hypot(Drivebase.DRIVETRAIN_TRACKWIDTH_METERS / 2.0, Drivebase.DRIVETRAIN_WHEELBASE_METERS / 2.0);

    kinematics = new SwerveDriveKinematics(
        new Translation2d(Drivebase.DRIVETRAIN_TRACKWIDTH_METERS / 2.0, Drivebase.DRIVETRAIN_TRACKWIDTH_METERS / 2.0),
        new Translation2d(Drivebase.DRIVETRAIN_TRACKWIDTH_METERS / 2.0, -Drivebase.DRIVETRAIN_TRACKWIDTH_METERS / 2.0),
        new Translation2d(-Drivebase.DRIVETRAIN_TRACKWIDTH_METERS / 2.0, Drivebase.DRIVETRAIN_TRACKWIDTH_METERS / 2.0),
        new Translation2d(-Drivebase.DRIVETRAIN_TRACKWIDTH_METERS / 2.0, -Drivebase.DRIVETRAIN_TRACKWIDTH_METERS / 2.0),
    )
    
    frontLeftModule: SwerveModule;
    frontRightModule: SwerveModule;
    backLeftModule: SwerveModule;
    backRightModule: SwerveModule;

    chassisSpeeds = new ChassisSpeeds(0,0,0)

    constructor() {
        
    }

    wrapper?: JSSubsystemWrapper;
    subsysInit(wrapper: JSSubsystemWrapper): void {
        const config = MkModuleConfiguration.getDefaultSteerFalcon500();

        config.setDriveCurrentLimit(40);
        config.setSteerCurrentLimit(30);

        this.frontLeftModule = new MkSwerveModuleBuilder(config)
            .withGearRatio(SdsModuleConfigurations.MK4_L2)
            .withDriveMotor(MotorType.FALCON, Drivebase.FRONT_LEFT_MODULE_DRIVE_MOTOR, Drivebase.CANBUS_DRIVETRAIN)
            .withSteerMotor(MotorType.FALCON, Drivebase.FRONT_LEFT_MODULE_STEER_MOTOR, Drivebase.CANBUS_DRIVETRAIN)
            .withSteerEncoderPort(Drivebase.FRONT_LEFT_MODULE_STEER_ENCODER, Drivebase.CANBUS_DRIVETRAIN)
            .withSteerOffset(Drivebase.FRONT_LEFT_MODULE_STEER_OFFSET)
            .build();
        
        this.frontRightModule = new MkSwerveModuleBuilder(config)
            .withGearRatio(SdsModuleConfigurations.MK4_L2)
            .withDriveMotor(MotorType.FALCON, Drivebase.FRONT_RIGHT_MODULE_DRIVE_MOTOR, Drivebase.CANBUS_DRIVETRAIN)
            .withSteerMotor(MotorType.FALCON, Drivebase.FRONT_RIGHT_MODULE_STEER_MOTOR, Drivebase.CANBUS_DRIVETRAIN)
            .withSteerEncoderPort(Drivebase.FRONT_RIGHT_MODULE_STEER_ENCODER, Drivebase.CANBUS_DRIVETRAIN)
            .withSteerOffset(Drivebase.FRONT_RIGHT_MODULE_STEER_OFFSET)
            .build();
        
        this.backLeftModule = new MkSwerveModuleBuilder(config)
            .withGearRatio(SdsModuleConfigurations.MK4_L2)
            .withDriveMotor(MotorType.FALCON, Drivebase.BACK_LEFT_MODULE_DRIVE_MOTOR, Drivebase.CANBUS_DRIVETRAIN)
            .withSteerMotor(MotorType.FALCON, Drivebase.BACK_LEFT_MODULE_STEER_MOTOR, Drivebase.CANBUS_DRIVETRAIN)
            .withSteerEncoderPort(Drivebase.BACK_LEFT_MODULE_STEER_ENCODER, Drivebase.CANBUS_DRIVETRAIN)
            .withSteerOffset(Drivebase.BACK_LEFT_MODULE_STEER_OFFSET)
            .build();
        
        this.backRightModule = new MkSwerveModuleBuilder(config)
            .withGearRatio(SdsModuleConfigurations.MK4_L2)
            .withDriveMotor(MotorType.FALCON, Drivebase.BACK_RIGHT_MODULE_DRIVE_MOTOR, Drivebase.CANBUS_DRIVETRAIN)
            .withSteerMotor(MotorType.FALCON, Drivebase.BACK_RIGHT_MODULE_STEER_MOTOR, Drivebase.CANBUS_DRIVETRAIN)
            .withSteerEncoderPort(Drivebase.BACK_RIGHT_MODULE_STEER_ENCODER, Drivebase.CANBUS_DRIVETRAIN)
            .withSteerOffset(Drivebase.BACK_RIGHT_MODULE_STEER_OFFSET)
            .build();
    }

    drive(chassisSpeeds: ChassisSpeeds) {
        console.log(`Driving with: ${chassisSpeeds.vxMetersPerSecond}, ${chassisSpeeds.vyMetersPerSecond}`)
        const mod = new ChassisSpeeds(
            chassisSpeeds.vxMetersPerSecond,
            chassisSpeeds.vyMetersPerSecond,
            chassisSpeeds.omegaRadiansPerSecond
        )
        this.driveRaw(mod);
    }

    driveRaw(chassisSpeeds: ChassisSpeeds) {
        this.chassisSpeeds = chassisSpeeds;
    }

    stop() {
        this.driveRaw(new ChassisSpeeds());
    }

    public getPositions(): SwerveModulePosition[] {
        return [
            this.frontLeftModule.getPosition(),
            this.frontRightModule.getPosition(),
            this.backLeftModule.getPosition(),
            this.backRightModule.getPosition()
        ];
    }

    public getMotors(): WPI_TalonFX[] {
        const motors = [this.frontLeftModule, this.frontRightModule, this.backLeftModule, this.backRightModule];
        const lst = []
        for(const motor of motors) {
            lst.push(RobotUtil.fromMotorController(motor.getSteerMotor()));
            lst.push(RobotUtil.fromMotorController(motor.getDriveMotor()));
        }

        return lst;
    }

    periodic(): void {
        const zeroDeadzone = 0.001;

        // Set deadzone on translation
        if (Math.abs(this.chassisSpeeds.vxMetersPerSecond) < zeroDeadzone) {
            this.chassisSpeeds.vxMetersPerSecond = 0;
        }
        if (Math.abs(this.chassisSpeeds.vyMetersPerSecond) < zeroDeadzone) {
            this.chassisSpeeds.vyMetersPerSecond = 0;
        }

        // Hockey-lock if stopped by setting rotation to realllly low number
        if (this.chassisSpeeds.vxMetersPerSecond == 0 && 
            this.chassisSpeeds.vyMetersPerSecond == 0 && 
            Math.abs(this.chassisSpeeds.omegaRadiansPerSecond) < zeroDeadzone) {
            this.chassisSpeeds.omegaRadiansPerSecond = 0.00001;
        }

        SmartDashboard.putNumber("DT X spd", this.chassisSpeeds.vxMetersPerSecond);
        SmartDashboard.putNumber("DT Y spd", this.chassisSpeeds.vyMetersPerSecond);
        SmartDashboard.putNumber("DT . spd", Math.hypot(this.chassisSpeeds.vxMetersPerSecond, this.chassisSpeeds.vyMetersPerSecond));
        SmartDashboard.putNumber("DT O rot", this.chassisSpeeds.omegaRadiansPerSecond);

        const states = this.kinematics.toSwerveModuleStates(this.chassisSpeeds);

        SwerveDriveKinematics.desaturateWheelSpeeds(states, Drivebase.MAX_VELOCITY_METERS_PER_SECOND);

        const positions = this.getPositions();
        for (let i = 0; i < states.length; i++) {
            states[i] = SwerveModuleState.optimize(states[i], positions[i].angle);
        }

        let flVoltage;
        let frVoltage;
        let blVoltage;
        let brVoltage;

        flVoltage = states[0].speedMetersPerSecond;
        frVoltage = states[1].speedMetersPerSecond;
        blVoltage = states[2].speedMetersPerSecond;
        brVoltage = states[3].speedMetersPerSecond;

        // flVoltage = MathUtil.clamp(flVoltage, 0, MAX_VELOCITY_METERS_PER_SECOND);
        // frVoltage = MathUtil.clamp(frVoltage, 0, MAX_VELOCITY_METERS_PER_SECOND);
        // blVoltage = MathUtil.clamp(blVoltage, 0, MAX_VELOCITY_METERS_PER_SECOND);
        // brVoltage = MathUtil.clamp(brVoltage, 0, MAX_VELOCITY_METERS_PER_SECOND);

        // SmartDashboard.putNumber("Front Left Velocity", flVoltage);
        // SmartDashboard.putNumber("Front Right Velocity", frVoltage);
        // SmartDashboard.putNumber("Back Left Velocity", blVoltage);
        // SmartDashboard.putNumber("Back Right Velocity", brVoltage);

        flVoltage = flVoltage / Drivebase.MAX_VELOCITY_METERS_PER_SECOND * Drivebase.MAX_VOLTAGE;
        frVoltage = frVoltage / Drivebase.MAX_VELOCITY_METERS_PER_SECOND * Drivebase.MAX_VOLTAGE;
        blVoltage = blVoltage / Drivebase.MAX_VELOCITY_METERS_PER_SECOND * Drivebase.MAX_VOLTAGE;
        brVoltage = brVoltage / Drivebase.MAX_VELOCITY_METERS_PER_SECOND * Drivebase.MAX_VOLTAGE;

        this.frontLeftModule.set(flVoltage, states[0].angle.getRadians());
        this.frontRightModule.set(frVoltage, states[1].angle.getRadians());
        this.backLeftModule.set(blVoltage, states[2].angle.getRadians());
        this.backRightModule.set(brVoltage, states[3].angle.getRadians());
    }
}

class Systems {
    public drivebase: JSSubsystemWrapper;

    constructor() {
        this.drivebase = JSSubsystemWrapper.registerSubsystem(new Drivebase());
    }

    getDrivebase() {
        console.log(this.drivebase)
        return this.drivebase.baseObject as Drivebase;
    }
}

const robotContainer = new RobotContainer();
robotContainer.main()