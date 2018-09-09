public static void LoadPlayers()
{
	Main.PlayerList.Clear();
	Directory.CreateDirectory(Main.PlayerPath);
	string[] files = Directory.GetFiles(Main.PlayerPath, "*.plr");
	int num = Math.Min(Main.maxLoadPlayer, files.Length);
	for (int index = 0; index < num; ++index)
	{
		PlayerFileData fileData = Player.GetFileData(files[index], false);
		if (fileData != null)
			Main.PlayerList.Add(fileData);
	}
	if (SocialAPI.Cloud != null)
	{
		foreach (string file in SocialAPI.Cloud.GetFiles().Where<string>((Func<string, bool>) (path =>
		{
			if (path.StartsWith(Main.CloudPlayerPath, StringComparison.CurrentCultureIgnoreCase))
				return path.EndsWith(".plr", StringComparison.CurrentCultureIgnoreCase);
			return false;
		})))
		{
			PlayerFileData fileData = Player.GetFileData(file, true);
			if (fileData != null)
				Main.PlayerList.Add(fileData);
		}
	}
	Main.PlayerList.Sort(new Comparison<PlayerFileData>(Main.PlayerListSortMethod));
}

public static PlayerFileData GetFileData(string file, bool cloudSave)
{
	if (file == null || cloudSave && SocialAPI.Cloud == null)
		return (PlayerFileData) null;
	PlayerFileData playerFileData = Player.LoadPlayer(file, cloudSave);
	if (playerFileData.Player == null)
		return (PlayerFileData) null;
	if (playerFileData.Player.loadStatus != 0 && playerFileData.Player.loadStatus != 1)
	{
		if (FileUtilities.Exists(file + ".bak", cloudSave))
			FileUtilities.Move(file + ".bak", file, cloudSave, true);
		playerFileData = Player.LoadPlayer(file, cloudSave);
		if (playerFileData.Player == null)
			return (PlayerFileData) null;
	}
	return playerFileData;
}

public static PlayerFileData LoadPlayer(string playerPath, bool cloudSave)
{
	PlayerFileData playerFileData = new PlayerFileData(playerPath, cloudSave);
	if (cloudSave && SocialAPI.Cloud == null)
		return playerFileData;
	if (Main.rand == null)
		Main.rand = new UnifiedRandom((int) DateTime.Now.Ticks);
	Player player1 = new Player();
	try
	{
		RijndaelManaged rijndaelManaged = new RijndaelManaged();
		rijndaelManaged.Padding = PaddingMode.None;
		using (MemoryStream memoryStream = new MemoryStream(FileUtilities.ReadAllBytes(playerPath, cloudSave)))
		{
			using (CryptoStream cryptoStream = new CryptoStream((Stream) memoryStream, rijndaelManaged.CreateDecryptor(Player.ENCRYPTION_KEY, Player.ENCRYPTION_KEY), CryptoStreamMode.Read))
			{
				using (BinaryReader binaryReader = new BinaryReader((Stream) cryptoStream))
				{
					int release = binaryReader.ReadInt32();
					if (release >= 135)
						playerFileData.Metadata = FileMetadata.Read(binaryReader, FileType.Player);
					else
						playerFileData.Metadata = FileMetadata.FromCurrentSettings(FileType.Player);
// ---
   private void Read(BinaryReader reader)
    {
      long num1 = (long) reader.ReadUInt64();
      long num2 = 72057594037927935;
      if ((num1 & num2) != 27981915666277746L)
        throw new FileFormatException("Expected Re-Logic file format.");
      int num3 = 56;
      byte num4 = (byte) ((ulong) num1 >> num3 & (ulong) byte.MaxValue);
      FileType fileType = FileType.None;
      FileType[] values = (FileType[]) Enum.GetValues(typeof (FileType));
      for (int index = 0; index < values.Length; ++index)
      {
        if (values[index] == (FileType) num4)
        {
          fileType = values[index];
          break;
        }
      }
      if (fileType == FileType.None)
        throw new FileFormatException("Found invalid file type.");
      this.Type = fileType;
      this.Revision = reader.ReadUInt32();
      this.IsFavorite = ((long) reader.ReadUInt64() & 1L) == 1L;
    }
// ---
					if (release > 194)
					{
						player1.loadStatus = 1;
						player1.name = binaryReader.ReadString();
						playerFileData.Player = player1;
						return playerFileData;
					}
					player1.name = binaryReader.ReadString();
					if (release >= 10)
					{
						if (release >= 17)
							player1.difficulty = binaryReader.ReadByte();
						else if (binaryReader.ReadBoolean())
							player1.difficulty = (byte) 2;
					}
					if (release >= 138)
						playerFileData.SetPlayTime(new TimeSpan(binaryReader.ReadInt64()));
					else
						playerFileData.SetPlayTime(TimeSpan.Zero);
					player1.hair = binaryReader.ReadInt32();
					if (release >= 82)
						player1.hairDye = binaryReader.ReadByte();
					if (release >= 124)
					{
						BitsByte bitsByte = (BitsByte) binaryReader.ReadByte();
						for (int index = 0; index < 8; ++index)
							player1.hideVisual[index] = bitsByte[index];
						bitsByte = (BitsByte) binaryReader.ReadByte();
						for (int index = 0; index < 2; ++index)
							player1.hideVisual[index + 8] = bitsByte[index];
					}
					else if (release >= 83)
					{
						BitsByte bitsByte = (BitsByte) binaryReader.ReadByte();
						for (int index = 0; index < 8; ++index)
							player1.hideVisual[index] = bitsByte[index];
					}
					if (release >= 119)
						player1.hideMisc = (BitsByte) binaryReader.ReadByte();
					if (release <= 17)
						player1.Male = player1.hair != 5 && player1.hair != 6 && (player1.hair != 9 && player1.hair != 11);
					else if (release < 107)
						player1.Male = binaryReader.ReadBoolean();
					else
						player1.skinVariant = (int) binaryReader.ReadByte();
					if (release < 161 && player1.skinVariant == 7)
						player1.skinVariant = 9;
					player1.statLife = binaryReader.ReadInt32();
					player1.statLifeMax = binaryReader.ReadInt32();
					if (player1.statLifeMax > 500)
						player1.statLifeMax = 500;
					player1.statMana = binaryReader.ReadInt32();
					player1.statManaMax = binaryReader.ReadInt32();
					if (player1.statManaMax > 200)
						player1.statManaMax = 200;
					if (player1.statMana > 400)
						player1.statMana = 400;
					if (release >= 125)
						player1.extraAccessory = binaryReader.ReadBoolean();
					if (release >= 182)
						player1.downedDD2EventAnyDifficulty = binaryReader.ReadBoolean();
					if (release >= 128)
						player1.taxMoney = binaryReader.ReadInt32();
					player1.hairColor = binaryReader.ReadRGB();
					player1.skinColor = binaryReader.ReadRGB();
					player1.eyeColor = binaryReader.ReadRGB();
					player1.shirtColor = binaryReader.ReadRGB();
					player1.underShirtColor = binaryReader.ReadRGB();
					player1.pantsColor = binaryReader.ReadRGB();
					player1.shoeColor = binaryReader.ReadRGB();
					Main.player[Main.myPlayer].shirtColor = player1.shirtColor;
					Main.player[Main.myPlayer].pantsColor = player1.pantsColor;
					Main.player[Main.myPlayer].hairColor = player1.hairColor;
					if (release >= 38)
					{
						if (release < 124)
						{
							int num = 11;
							if (release >= 81)
								num = 16;
							for (int index1 = 0; index1 < num; ++index1)
							{
								int index2 = index1;
								if (index2 >= 8)
									index2 += 2;
								player1.armor[index2].netDefaults(binaryReader.ReadInt32());
								player1.armor[index2].Prefix((int) binaryReader.ReadByte());
							}
						}
						else
						{
							int num = 20;
							for (int index = 0; index < num; ++index)
							{
								player1.armor[index].netDefaults(binaryReader.ReadInt32());
								player1.armor[index].Prefix((int) binaryReader.ReadByte());
							}
						}
						if (release >= 47)
						{
							int num = 3;
							if (release >= 81)
								num = 8;
							if (release >= 124)
								num = 10;
							for (int index1 = 0; index1 < num; ++index1)
							{
								int index2 = index1;
								player1.dye[index2].netDefaults(binaryReader.ReadInt32());
								player1.dye[index2].Prefix((int) binaryReader.ReadByte());
							}
						}
						if (release >= 58)
						{
							for (int index = 0; index < 58; ++index)
							{
								int type = binaryReader.ReadInt32();
								if (type >= 3930)
								{
									player1.inventory[index].netDefaults(0);
									binaryReader.ReadInt32();
									int num = (int) binaryReader.ReadByte();
									if (release >= 114)
										binaryReader.ReadBoolean();
								}
								else
								{
									player1.inventory[index].netDefaults(type);
									player1.inventory[index].stack = binaryReader.ReadInt32();
									player1.inventory[index].Prefix((int) binaryReader.ReadByte());
									if (release >= 114)
										player1.inventory[index].favorited = binaryReader.ReadBoolean();
								}
							}
						}
						else
						{
							for (int index = 0; index < 48; ++index)
							{
								int type = binaryReader.ReadInt32();
								if (type >= 3930)
								{
									player1.inventory[index].netDefaults(0);
									binaryReader.ReadInt32();
									int num = (int) binaryReader.ReadByte();
								}
								else
								{
									player1.inventory[index].netDefaults(type);
									player1.inventory[index].stack = binaryReader.ReadInt32();
									player1.inventory[index].Prefix((int) binaryReader.ReadByte());
								}
							}
						}
						if (release >= 117)
						{
							if (release < 136)
							{
								for (int index = 0; index < 5; ++index)
								{
									if (index != 1)
									{
										int type1 = binaryReader.ReadInt32();
										if (type1 >= 3930)
										{
											player1.miscEquips[index].netDefaults(0);
											int num = (int) binaryReader.ReadByte();
										}
										else
										{
											player1.miscEquips[index].netDefaults(type1);
											player1.miscEquips[index].Prefix((int) binaryReader.ReadByte());
										}
										int type2 = binaryReader.ReadInt32();
										if (type2 >= 3930)
										{
											player1.miscDyes[index].netDefaults(0);
											int num = (int) binaryReader.ReadByte();
										}
										else
										{
											player1.miscDyes[index].netDefaults(type2);
											player1.miscDyes[index].Prefix((int) binaryReader.ReadByte());
										}
									}
								}
							}
							else
							{
								for (int index = 0; index < 5; ++index)
								{
									int type1 = binaryReader.ReadInt32();
									if (type1 >= 3930)
									{
										player1.miscEquips[index].netDefaults(0);
										int num = (int) binaryReader.ReadByte();
									}
									else
									{
										player1.miscEquips[index].netDefaults(type1);
										player1.miscEquips[index].Prefix((int) binaryReader.ReadByte());
									}
									int type2 = binaryReader.ReadInt32();
									if (type2 >= 3930)
									{
										player1.miscDyes[index].netDefaults(0);
										int num = (int) binaryReader.ReadByte();
									}
									else
									{
										player1.miscDyes[index].netDefaults(type2);
										player1.miscDyes[index].Prefix((int) binaryReader.ReadByte());
									}
								}
							}
						}
						if (release >= 58)
						{
							for (int index = 0; index < 40; ++index)
							{
								player1.bank.item[index].netDefaults(binaryReader.ReadInt32());
								player1.bank.item[index].stack = binaryReader.ReadInt32();
								player1.bank.item[index].Prefix((int) binaryReader.ReadByte());
							}
							for (int index = 0; index < 40; ++index)
							{
								player1.bank2.item[index].netDefaults(binaryReader.ReadInt32());
								player1.bank2.item[index].stack = binaryReader.ReadInt32();
								player1.bank2.item[index].Prefix((int) binaryReader.ReadByte());
							}
						}
						else
						{
							for (int index = 0; index < 20; ++index)
							{
								player1.bank.item[index].netDefaults(binaryReader.ReadInt32());
								player1.bank.item[index].stack = binaryReader.ReadInt32();
								player1.bank.item[index].Prefix((int) binaryReader.ReadByte());
							}
							for (int index = 0; index < 20; ++index)
							{
								player1.bank2.item[index].netDefaults(binaryReader.ReadInt32());
								player1.bank2.item[index].stack = binaryReader.ReadInt32();
								player1.bank2.item[index].Prefix((int) binaryReader.ReadByte());
							}
						}
						if (release >= 182)
						{
							for (int index = 0; index < 40; ++index)
							{
								player1.bank3.item[index].netDefaults(binaryReader.ReadInt32());
								player1.bank3.item[index].stack = binaryReader.ReadInt32();
								player1.bank3.item[index].Prefix((int) binaryReader.ReadByte());
							}
						}
					}
					else
					{
						for (int index = 0; index < 8; ++index)
						{
							player1.armor[index].SetDefaults((int) ItemID.FromLegacyName(binaryReader.ReadString(), release), false);
							if (release >= 36)
								player1.armor[index].Prefix((int) binaryReader.ReadByte());
						}
						if (release >= 6)
						{
							for (int index = 8; index < 11; ++index)
							{
								player1.armor[index].SetDefaults((int) ItemID.FromLegacyName(binaryReader.ReadString(), release), false);
								if (release >= 36)
									player1.armor[index].Prefix((int) binaryReader.ReadByte());
							}
						}
						for (int index = 0; index < 44; ++index)
						{
							player1.inventory[index].SetDefaults((int) ItemID.FromLegacyName(binaryReader.ReadString(), release), false);
							player1.inventory[index].stack = binaryReader.ReadInt32();
							if (release >= 36)
								player1.inventory[index].Prefix((int) binaryReader.ReadByte());
						}
						if (release >= 15)
						{
							for (int index = 44; index < 48; ++index)
							{
								player1.inventory[index].SetDefaults((int) ItemID.FromLegacyName(binaryReader.ReadString(), release), false);
								player1.inventory[index].stack = binaryReader.ReadInt32();
								if (release >= 36)
									player1.inventory[index].Prefix((int) binaryReader.ReadByte());
							}
						}
						for (int index = 0; index < 20; ++index)
						{
							player1.bank.item[index].SetDefaults((int) ItemID.FromLegacyName(binaryReader.ReadString(), release), false);
							player1.bank.item[index].stack = binaryReader.ReadInt32();
							if (release >= 36)
								player1.bank.item[index].Prefix((int) binaryReader.ReadByte());
						}
						if (release >= 20)
						{
							for (int index = 0; index < 20; ++index)
							{
								player1.bank2.item[index].SetDefaults((int) ItemID.FromLegacyName(binaryReader.ReadString(), release), false);
								player1.bank2.item[index].stack = binaryReader.ReadInt32();
								if (release >= 36)
									player1.bank2.item[index].Prefix((int) binaryReader.ReadByte());
							}
						}
					}
					if (release < 58)
					{
						for (int index = 40; index < 48; ++index)
						{
							player1.inventory[index + 10] = player1.inventory[index].Clone();
							player1.inventory[index].SetDefaults(0, false);
						}
					}
					if (release >= 11)
					{
						int num = 22;
						if (release < 74)
							num = 10;
						for (int index = 0; index < num; ++index)
						{
							player1.buffType[index] = binaryReader.ReadInt32();
							player1.buffTime[index] = binaryReader.ReadInt32();
							if (player1.buffType[index] == 0)
							{
								--index;
								--num;
							}
						}
					}
					for (int index = 0; index < 200; ++index)
					{
						int num = binaryReader.ReadInt32();
						if (num != -1)
						{
							player1.spX[index] = num;
							player1.spY[index] = binaryReader.ReadInt32();
							player1.spI[index] = binaryReader.ReadInt32();
							player1.spN[index] = binaryReader.ReadString();
						}
						else
							break;
					}
					if (release >= 16)
						player1.hbLocked = binaryReader.ReadBoolean();
					if (release >= 115)
					{
						int num = 13;
						for (int index = 0; index < num; ++index)
							player1.hideInfo[index] = binaryReader.ReadBoolean();
					}
					if (release >= 98)
						player1.anglerQuestsFinished = binaryReader.ReadInt32();
					if (release >= 162)
					{
						for (int index = 0; index < 4; ++index)
							player1.DpadRadial.Bindings[index] = binaryReader.ReadInt32();
					}
					if (release >= 164)
					{
						int num = 8;
						if (release >= 167)
							num = 10;
						for (int index = 0; index < num; ++index)
							player1.builderAccStatus[index] = binaryReader.ReadInt32();
					}
					if (release >= 181)
						player1.bartenderQuestLog = binaryReader.ReadInt32();
					player1.skinVariant = (int) MathHelper.Clamp((float) player1.skinVariant, 0.0f, 9f);
					for (int index = 3; index < 8 + player1.extraAccessorySlots; ++index)
					{
						int type = player1.armor[index].type;
						if (type == 908)
							player1.lavaMax += 420;
						if (type == 906)
							player1.lavaMax += 420;
						if (player1.wingsLogic == 0 && (int) player1.armor[index].wingSlot >= 0)
							player1.wingsLogic = (int) player1.armor[index].wingSlot;
						if (type == 158 || type == 396 || (type == 1250 || type == 1251) || type == 1252)
							player1.noFallDmg = true;
						player1.lavaTime = player1.lavaMax;
					}
				}
			}
		}
		player1.PlayerFrame();
		player1.loadStatus = 0;
		playerFileData.Player = player1;
		return playerFileData;
	}
	catch
	{
	}
	Player player2 = new Player();
	player2.loadStatus = 2;
	if (player1.name != "")
	{
		player2.name = player1.name;
	}
	else
	{
		string[] strArray = playerPath.Split(Path.DirectorySeparatorChar);
		player1.name = strArray[strArray.Length - 1].Split('.')[0];
	}
	playerFileData.Player = player2;
	return playerFileData;
}