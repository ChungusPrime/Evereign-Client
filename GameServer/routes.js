router.post('/create_character', async (req, res) => {
  const Data = [];
  Data.push(req.body.id);
  Data.push(req.body.name);
  Data.push(req.body.class);
  Data.push(1);
  Data.push(req.body.faction);
  Data.push(req.body.race);
  Data.push("Opalla Port");
  Data.push(752);
  Data.push(1926);
  Data.push(0);

  if ( req.body.class == "Gladiator" ) {
    Data.push(50);
    Data.push(50);
    Data.push(9);
    Data.push(3);
    Data.push(5);
    Data.push(6);
    Data.push(6);
    Data.push(7);
    Data.push(3);
    Data.push("Adrenaline");
    Data.push(0);
    Data.push(100);
  } else if ( req.body.class == "Lightbringer" ) {
    Data.push(40);
    Data.push(40);
    Data.push(8);
    Data.push(4);
    Data.push(6);
    Data.push(4);
    Data.push(5);
    Data.push(7);
    Data.push(6);
    Data.push("Holy Power");
    Data.push(0);
    Data.push(100);
  } else if ( req.body.class == "Operative" ) {
    Data.push(30);
    Data.push(30);
    Data.push(4);
    Data.push(4);
    Data.push(5);
    Data.push(8);
    Data.push(7);
    Data.push(4);
    Data.push(3);
    Data.push("Momentum");
    Data.push(0);
    Data.push(10);
  }

  console.log(Data);

  const result = await db.promise().query(
    `INSERT INTO characters (player_id, name, class, level, faction, race, area, x, y, exp, current_health, max_health, strength, intelligence, willpower, agility, speed, endurance, personality, resource, current_resource, max_resource)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, Data);
  res.json({message: "Character created successfully!", id: result.insertId});
});

module.exports = router;
