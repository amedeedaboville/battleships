inviteStream.on('invite', function(messgae) {
    console.log('received invite');
    $.UIkit.notify({
    message : '<button>accept</button>' + this.userId + ' wants to challenge you to a battleship duel!', 
    status  : 'info',
    timeout : 5000,
    pos     : 'bottom-center'
    });
})

