var RobotContainer = /** @class */ (function () {
    function RobotContainer() {
    }
    RobotContainer.prototype.main = function () {
        console.log("testing");
        this.systems = new Systems();
        this.driver = new CommandXboxController(0);
        this.driver.a().onTrue(JSCommandWrapper.createJCommand(new DriveCommand()));
        SmartDashboard.putNumber("loops", 0);
    };
    return RobotContainer;
}());
// RobotUtil.registerPeriodic(() => {
//     console.log("Hello, World!")
// });
var robotContainer = new RobotContainer();
var Systems = /** @class */ (function () {
    function Systems() {
        this.driveBase = new DriveBase();
        this.drivebaseWrapper = JSSubsystemWrapper.registerSubsystem(this.driveBase);
    }
    Systems.prototype.getDrivebase = function () {
        return this.driveBase;
    };
    Systems.prototype.getDrivebaseWrapper = function () {
        return this.drivebaseWrapper;
    };
    return Systems;
}());
var DriveBase = /** @class */ (function () {
    function DriveBase() {
    }
    DriveBase.prototype.subsysInit = function (wrapper) {
        this.wrapper = wrapper;
    };
    return DriveBase;
}());
var DriveCommand = /** @class */ (function () {
    function DriveCommand() {
    }
    DriveCommand.prototype.initialize = function () {
        this.loops = 0;
        this.addRequirements([robotContainer.systems.getDrivebaseWrapper()]);
        this.drivebase = robotContainer.systems.getDrivebase();
    };
    DriveCommand.prototype.isFinished = function () {
        return this.loops > 150;
    };
    DriveCommand.prototype.execute = function () {
        SmartDashboard.putNumber("loops", this.loops);
        this.loops++;
    };
    DriveCommand.prototype.end = function (interrupted) {
        this.loops = 0;
    };
    return DriveCommand;
}());
robotContainer.main();
