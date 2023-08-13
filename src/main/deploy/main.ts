class RobotContainer {
    systems: Systems;
    driver: CommandXboxController;
    
    public main() {
        console.log("testing")
        this.systems = new Systems();


        this.driver = new CommandXboxController(0);

        this.driver.a().onTrue(JSCommandWrapper.createJCommand(new DriveCommand()));

        
        SmartDashboard.putNumber("loops", 0);
    }
}

// RobotUtil.registerPeriodic(() => {
//     console.log("Hello, World!")
// });

const robotContainer = new RobotContainer();

class Systems {
    private driveBase: DriveBase;
    private drivebaseWrapper: JSSubsystemWrapper;

    constructor() {
        this.driveBase = new DriveBase();
        this.drivebaseWrapper = JSSubsystemWrapper.registerSubsystem(this.driveBase);
    }

    getDrivebase() {
        return this.driveBase;
    }

    getDrivebaseWrapper() {
        return this.drivebaseWrapper;
    }
}



class DriveBase implements SubsystemBase {
    wrapper?: JSSubsystemWrapper;

    subsysInit(wrapper: JSSubsystemWrapper): void {
        this.wrapper = wrapper;
    }
}

class DriveCommand implements CommandBase {
    addRequirements?: (requirements: JSSubsystemWrapper[]) => void;
    drivebase: DriveBase;
    loops: number;

    initialize() {
        
        this.loops = 0;
        this.addRequirements([robotContainer.systems.getDrivebaseWrapper()]);
        this.drivebase = robotContainer.systems.getDrivebase();
    }
    isFinished(): boolean {
        return this.loops > 150;
    }
    execute(): void {
        SmartDashboard.putNumber("loops", this.loops);
        this.loops++;
    }
    end(interrupted: boolean): void {
        this.loops = 0;
    }
    
}

robotContainer.main();