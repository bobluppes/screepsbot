export function roleMiner(creep: Creep) {

    // Visually identify creep every 5 game ticks
    if (Game.time % 5 == 0) {
        creep.say(`M`);
    }

    // Determine working state based on the amount of carried energy
    if (creep.carry.energy === 0) {
        creep.memory.working = true;
    } else if (creep.carry.energy === creep.carryCapacity) {
        creep.memory.working = false;
    }

    if (creep.memory.working === true) {
        // Target the source from the creeps memory
        const target = creep.memory.source;

        // Mine the source
        if (creep.memory.source) {
            if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target.pos);
            } else if (!creep.memory.container && creep.harvest(target) === OK) {

                // Check if a construction site or container already exists and if not pop one
                let sites: ConstructionSite[] = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 1);
                let containers: AnyStructure[] = creep.pos.findInRange(FIND_STRUCTURES, 1, {
                    filter: (i) => (i.structureType === STRUCTURE_CONTAINER)
                });
                if (sites.length > 0 || containers.length > 0) {
                    creep.memory.container = true;
                } else {
                    // Pop container on the ground
                    creep.room.createConstructionSite(creep.pos, STRUCTURE_CONTAINER);
                    creep.memory.container = true;
                }
            }
        }
    } else if (creep.memory.working === false) {

        // If container construction site is present
        // Drop half the energy and use the rest to build the site
        let sites: ConstructionSite[] = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 1);
        if (sites.length > 0) {
            creep.drop(RESOURCE_ENERGY, creep.carry.energy / 2);
            creep.build(sites[0]);
        } else {
            creep.drop(RESOURCE_ENERGY);
        }
    }

}
