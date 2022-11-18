if (!canvas.tokens.controlled || canvas.tokens.controlled == 0) {
    ui.notifications.error("No token selected")
    return
}

function increaseStress(actor, stress) {
    var mp = actor.system.mindPoints
    var newStress = mp.value - stress
    mp.value = newStress < mp.min ? mp.min : newStress
    console.log(`New stress ${mp.value}`)
}

canvas.tokens.controlled.forEach(t => {
    var stress = t.actor.system.mindPoints.max - t.actor.system.mindPoints.value
    console.log('Stress:' + stress)
    let r = new Roll(`1d6 + @stress`, {stress: stress}).evaluate({ async: false });
    r.toMessage({
        rollMode: 'roll',
        speaker: {
            alias: t.actor.name
        },
    });

    effectMessage = "Suppression check - "
    switch (r.total) {
        case 1:
        case 2:
            effectMessage += "Unaffected"
            break
        case 3:
        case 4:
        case 5:
            effectMessage += "Shaken: Suffer 1 Stress"
            increaseStress(t.actor, 1)
            break
        case 6:
        case 7:
        case 8:
            effectMessage += "Suppressed: Suffer 1 Stress, lose your next FAST action"
            increaseStress(t.actor, 1)
            break
        default:
            effectMessage += "Pinned Down: Suffer 1 Stress, lose your next SLOW action"
            increaseStress(t.actor, 1)
    }
    ChatMessage.create({
        content: effectMessage,
        speaker: {
            alias: t.actor.name
        }
    });
});