const {SlashCommandBuilder} = require('@discordjs/builders');
const connection = require("../database/db.js")
const scramble = require("scrambleword.js")
let map = new Map();

module.exports = {

    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Work to earn some money, can be done every 5 minutes.'), async execute(client, interaction) {

        if (map.has(interaction.user.username)) return interaction.reply({
            content: "You have already used this command within the past 5 minutes. Please try again later.",
            ephemeral: true
        })

        map.set(interaction.user.username, interaction.user.id)

        callRandomWork(interaction)


        setTimeout(() => {
            map.delete(interaction.user.username)
        }, 300000);

    }
}

//counting game
function math(interaction) {
    const num1 = Math.floor(Math.random() * (20 - 5 + 1)) + 5;
    const num2 = Math.floor(Math.random() * (20 - 5 + 1)) + 5;
    const addBal = Math.floor(Math.random() * (20 - 5 + 1)) + 5;
    const answer = num1 + num2

    interaction.reply({content: `What is ${num1} + ${num2}? Answer within 15 seconds!`})


    const filter = m => (m.author.id = interaction.user.id) && (!m.author.bot)

    const collector = interaction.channel.createMessageCollector({filter, max: 1, time: 15000})
    connection.query(`SELECT *
                      FROM eco`, (err, row) => {
        collector.on('collect', m => {
            if (m.toString() === answer.toString()) {
                interaction.followUp(`Correct, ${addBal} has been added to your balance.`)
                connection.query(`UPDATE eco
                                  SET bal = ${row[0].bal + addBal}
                                  WHERE id = ${interaction.user.id}`)

            } else {
                interaction.followUp("Incorrect, try again in 5 minutes.")
            }
        })
    })
}

// repeat the word game
function repeat(interaction) {
    const addBal = Math.floor(Math.random() * (20 - 5 + 1)) + 5;
    var textArray = ['minecraft', 'cheese', 'games', 'skate', 'streamer', 'computer']
    var randomWord = Math.floor(Math.random() * textArray.length).toString();
    var word = textArray[randomWord]

    interaction.reply(`Repeat this word: \`${word}\` `)

    const filter = m => (m.author.id = interaction.user.id) && (!m.author.bot)

    const collector = interaction.channel.createMessageCollector({filter, max: 1, time: 15000})
    connection.query(`SELECT *
                      FROM eco`, (err, row) => {
        collector.on('collect', m => {
            if (m.toString() === word.toString()) {
                interaction.followUp(`Correct, ${addBal} has been added to your balance.`)
                connection.query(`UPDATE eco
                                  SET bal = ${row[0].bal + addBal}
                                  WHERE id = ${interaction.user.id}`)

            } else {
                interaction.followUp("Incorrect, try again in 5 minutes.")
            }
        })
    })
}

// guess the word game
function wordGuess(interaction) {

    const addBal = Math.floor(Math.random() * (20 - 5 + 1)) + 5;
    var textArray = ['minecraft', 'cheese', 'games', 'skate', 'streamer', 'computer']
    var randomWord = Math.floor(Math.random() * textArray.length).toString();
    var word = textArray[randomWord]
    const newWord = scramble(textArray[randomWord]);


    interaction.reply(`Unscramble this word: \`${newWord}\` `)

    const filter = m => (m.author.id = interaction.user.id) && (!m.author.bot)

    const collector = interaction.channel.createMessageCollector({filter, max: 1, time: 15000})
    connection.query(`SELECT *
                      FROM eco`, (err, row) => {
        collector.on('collect', m => {
            if (m.toString() === word.toString()) {
                interaction.followUp(`Correct, ${addBal} has been added to your balance.`)
                connection.query(`UPDATE eco
                                  SET bal = ${row[0].bal + addBal}
                                  WHERE id = ${interaction.user.id}`)

            } else {
                interaction.followUp("Incorrect, try again in 5 minutes.")
            }
        })
    })
}

function callRandomWork(interaction) {
    const random = Math.floor(Math.random()*3);
    switch(random){
        case 0:
            repeat(interaction);
            break;
        case 1:
        wordGuess(interaction)
            break;
        case 2:
            math(interaction)
            break;
    }
}
