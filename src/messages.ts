const messages = {
  "tutorials.basics.0":
    "Reflector is a turn-based game. Colonists <entity>COLONIST</entity> and enemies <entity>ENEMY_DRONE</entity> move when you <entity>PLAYER</entity> move. <br></br>Try moving by <b>clicking the map</b>, or using the <kbd>wasd</kbd> or arrow keys.",
  "tutorials.basics.1":
    "You need to build places for colonists to work. Let's start by building a farm.<br></br>In the bottom menu, <b>click Work</b> then <b>click Farm</b>, or use the number keys to make your selection.",
  "tutorials.basics.2":
    "Farms are free to build, but must be built on fertile land <entity>TERRAIN_FERTILE</entity>. <b>Click the location</b> you want to build. You might need to move if no fertile land is in range.<br></br>If you prefer keyboard controls, hold <kbd>shift</kbd> and press <kbd>wasd</kbd> or arrows to move the blueprint, then press <kbd>space</kbd> to build.",
  "tutorials.basics.3":
    "Great! Your colonists need 10 food each per day, and 1 farm should be enough for now.<br></br>Unlike farms, most buildings require resources to build, so let's place a couple mining spots on ore for your other colonists to work at.<br></br><b>Select Work</b>, then <b>Mining Spot</b>, then place two of them on ore <entity>TERRAIN_ORE</entity>. You can hold down <b>Shift</b> when you click to place another.",
  "tutorials.basics.4":
    "That's one down, but one colonist still needs a job. Place another mining spot on ore <entity>TERRAIN_ORE</entity>.",
  "tutorials.basics.5":
    "Your colonists will automatically move to your farms and mining spots to work, but remember, they only move when you take a turn (move, build, fire, or wait).<br></br>Your colonists will need somewhere to sleep at night. Build <b>3 Tents</b> from the <b>Misc</b> category.",
  "tutorials.basics.6":
    "You can skip your turn without moving by <b>clicking the wait button</b> at the bottom or pressing <kbd>z</kbd>.<br></br>Move or wait until you have 8 metal. It might take a few turns for your colonists to reach their work places if they haven't arrived already.",
  "tutorials.basics.7":
    "Many buildings and jobs require power to function. To start producing power, let's build a windmill, under the <b>Power</b> category.",
  "tutorials.basics.8":
    "Let's use that power and build a <b>Projector</b> from the <b>Defense</b> category!<br></br>Projectors let you place reflectors around them and are critical to defense.<br></br>Note the blue border while placing your projector -- that shows everywhere you can place reflectors. You can always place within 2 spaces of your character.",
  "tutorials.basics.9":
    "You're off to a great start! Continue collecting resources and building your colony.<br></br>You'll learn about combat at night!",

  "tutorials.combat.0":
    "It is now night. Your colonists <entity>COLONIST</entity> will stop working and go to sleep, and enemies <entity>ENEMY_DRONE</entity> will attack, so it's time to learn how to fight!<br></br>To activate your laser, <b>click Activate</b> or press <kbd>f</kbd>.",
  "tutorials.combat.1":
    "You are now aiming your laser, but haven't fired yet.<br></br>Use the <b>arrow buttons</b>, arrow keys, or <kbd>wasd</kbd> to change what direction you're aiming in.",
  "tutorials.combat.2":
    "Now let's reflect that laser! You can place reflectors within 2 spaces of yourself.<br></br>To do so, <b>click within the blue borders</b> while aiming. Try placing one on your laser.<br></br>For keyboard controls, hold <kbd>shift</kbd> and press the arrow keys or <kbd>wasd</kbd> to select a position, then press <kbd>space</kbd>.",
  "tutorials.combat.3":
    "You can place as many reflectors as you want, as long as they're within range. Try placing another one.",
  "tutorials.combat.4":
    "Great! You can <b>click</b> (or press <kbd>space</kbd>) again to rotate the reflector.",
  "tutorials.combat.5":
    "And <b>click</b> (or press <kbd>space</kbd>) again to remove the reflector.",
  "tutorials.combat.6":
    "Once you are ready to fire, press <kbd>f</kbd> again or <b>click Fire</b>. <entity>LASER_BURST</entity> indicates what will be destroyed by the laser.<br></br>You can also <b>click Cancel</b> or press <kbd>q</kbd> to cancel.",
  "tutorials.combat.7":
    "Your laser needs to recharge. It will be ready to fire again next turn.",
  "tutorials.combat.8":
    "You now know the basics of combat. Make the most of each shot and try to hit multiple enemies.<br></br>When you have the resources to spare, experiment with the various buildings in the <b>Defense</b> category.<br></br>You're on your own now. Good luck!",

  "tutorials.morale.0":
    "Uh-oh, looks like you've lost morale! This happens whenever a colonist dies, or if you don't have enough food (1 per colonist) at night.<br></br>Morale cannot be recovered, and if you run out, you lose!<br></br>You can undo your most recent turn by <b>clicking the undo button</b> in the bottom menu or pressing <kbd>ctrl+z</kbd>.",

  "tutorials.jobPriorities.0":
    "You have more jobs than colonists. Job priorities control which jobs are filled, and which are left empty.<br></br><b>Click and drag a job</b> to change priority, or press <kbd>j</kbd> to access keyboard controls.",
  "tutorials.jobPriorities.1":
    "For more granular control, you can disable individual buildings.<br></br><b>Right click a building</b> and then <b>click Disable Jobs</b> to do so.<br></br>For keyboard controls, use <kbd>shift</kbd> and arrows/<kbd>wasd</kbd> to move your cursor to a building then press <kbd>e</kbd>.",
  "tutorials.jobPriorities.2":
    "Colonists will completely ignore jobs at disabled buildings. You can re-enable them the same way you disabled them.<br></br>Use building disabling and job priorities to control where your colonists work.",

  "tutorials.residence.0":
    "You don't have enough housing <entity>BUILDING_TENT</entity><entity>BUILDING_RESIDENCE</entity> for all of your colonists. Your homeless colonists will wander randomly at night.<br></br>If you want to control where your colonists sleep so they're easier to defend, build a <b>Residences or Tents</b> (in the Misc category).",

  "tutorials.rotate.0":
    "Some buildings, such as the Splitter, are rotatable. Press <kbd>r</kbd> or click the <b>Rotate</b> button at the bottom to rotate before you build.",
};

export default messages;
