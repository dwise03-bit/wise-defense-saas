import React, { useMemo, useState } from "react";
import { Target, SlidersHorizontal, Upload, Loader } from "lucide-react";

const DEFAULT_SYSTEMS = [
  {
    name: "WISE TOUCH MECHA RONIN™",
    category: "Cyberpunk",
    tags: ["cyberpunk", "armor", "samurai", "chrome", "luxury"],
    vibe: "Luxury cyber-samurai, tokusatsu, chrome armor, ornate ronin mythology, and futuristic feudal visual systems.",
    subsystems: ["CHROME SHOGUN™", "TOKUSATSU NOIR™", "RONIN CHROME™", "MECHA DAIMYO™", "ARMOR RELIC™", "FUTURE SHOGUNATE™", "VOID VISOR™", "ORNATE TITAN™", "CHROME KABUTO™", "METAL DYNASTY™", "CRIMSON SENTAI™", "FAITH ARMOR™", "LOVE RONIN™", "HOPE TITAN™", "JUSTICE CORE™", "MECHA TEMPLE™", "IMPERIAL VISOR™", "CYBER FEUDAL™", "SHOGUN FUTURE™", "DRAGON PLATE™"]
  },
  {
    name: "WISE TOUCH MECHA ANIMAL™",
    category: "Cartoon / Graphic",
    tags: ["mecha", "animal", "mascot", "racing", "cyberpunk"],
    vibe: "Stylized creature and mascot systems fused with futuristic armor, racing gear, cyber suits, and collectible figure energy.",
    subsystems: ["STREET RIDER™", "HELMET DOLL™", "FUTURE RACER™", "MECHA PET™", "CYBER ANIMAL™", "STORM SUIT™", "CIRCUIT ARMOR™", "SPEED CORE™", "FUTURE MASCOT™", "TOKYO RIDER™", "VISOR GIRL™", "CHROME RIDER™", "APEX SUIT™", "WHITE VOID RACER™"]
  },
  {
    name: "WISE TOUCH MOTIVATIONAL NOIR™",
    category: "Street / Gothic",
    tags: ["noir", "typography", "discipline", "skull", "gritty"],
    vibe: "Dark self-improvement poster systems using red and black typography, skulls, distortion, emotional discipline messaging, and cinematic grit.",
    subsystems: ["DISCIPLINE CORE™", "RED STATIC™", "SELF RESPECT™", "GLITCH SKULL™", "MOTION DECAY™", "VOID MOTIVATION™", "PAIN TYPE™", "BLOOD TYPO™", "DISTORTED DRIVE™", "PRESSURE MINDSET™", "SHADOW DISCIPLINE™", "NOIR SELFHELP™"]
  },
  {
    name: "WISE TOUCH COMIC FUSION™",
    category: "Cartoon / Graphic",
    tags: ["comic", "graffiti", "anime", "crossover", "cinematic"],
    vibe: "Comic-book crossover systems mixing heroes, pop icons, graffiti, manga, anime, and cinematic mashup layouts.",
    subsystems: ["STREET CROSSOVER™", "HERO COLLISION™", "ANIME PANEL™", "GRAFFITI HERO™", "MULTIVERSE PRINT™", "COMIC CHAOS™", "RETRO PANEL™", "CROSSOVER COVER™", "HERO NOIR™", "FUSION SPLASH™"]
  },
  {
    name: "WISE TOUCH RETRO TOYCORE™",
    category: "Retro Cartoon",
    tags: ["toy", "vhs", "nostalgic", "packaging", "cartoon"],
    vibe: "Vintage action figure, toy-commercial, collectible packaging, blister-pack, and retro toy aisle aesthetics.",
    subsystems: ["VHS TOYBOX™", "RETRO PLASTIC™", "SATURDAY MORNING™", "ACTION FIGURE NOIR™", "BLISTER PACK™", "TOY COMMERCIAL™", "VINYL HERO™", "CARTOON SHELF™", "NOSTALGIA CORE™", "TOY AISLE™", "GHOST TOY™", "RETRO COLLECTOR™"]
  },
  {
    name: "WISE TOUCH POP MASCOT™",
    category: "Cartoon / Graphic",
    tags: ["mascot", "sticker", "cartoon", "chaos", "streetwear"],
    vibe: "Cute-but-chaotic mascot systems with sticker aesthetics, emotional humor, cartoon rebellion, and apparel graphic energy.",
    subsystems: ["ANGRY MASCOT™", "CHAOS BEAR™", "TOXIC CUTIE™", "SKATER CREATURE™", "DOODLE PUNK™", "EMOTIONAL TOON™", "STICKER FIEND™", "CUTE RIOT™", "COLOR RIOT™", "HAPPY CHAOS™", "VECTOR REBEL™", "STREET CUTIE™"]
  },
  {
    name: "WISE TOUCH GOTHIC TOON™",
    category: "Retro Cartoon",
    tags: ["gothic", "rubberhose", "toon", "heartbreak", "noir"],
    vibe: "Vintage rubberhose cartoon horror blended with emotional noir and tattoo-flash graphic systems.",
    subsystems: ["DEAD INSIDE™", "BROKEN HEART CLUB™", "RUBBERHOSE NOIR™", "GOTHIC MASCOT™", "VINTAGE SADBOY™", "LOVE DECAY™", "INK GLOOM™", "EMO TOON™", "CARTOON MISERY™", "HEARTBREAK PRINT™"]
  },
  {
    name: "WISE TOUCH BIO HORROR™",
    category: "Cartoon / Graphic",
    tags: ["bio horror", "mutation", "slime", "grossout", "punk"],
    vibe: "Grotesque mutation cartoon systems inspired by underground comics, slime horror, punk grotesque art, and mutant anatomy.",
    subsystems: ["EYEBALL FREAK™", "TOXIC MUTATION™", "SLIME FLESH™", "HORROR STICKER™", "GROSSOUT CREATURE™", "MUTANT HEAD™", "BIO PUNK™", "COMIC ROT™", "FLESH VECTOR™", "DOOM DOODLE™"]
  },
  {
    name: "WISE TOUCH RETRO QUEST™",
    category: "Retro Cartoon",
    tags: ["retro game", "pixel", "arcade", "quest", "nostalgic"],
    vibe: "Retro video-game adventure systems with pixel legends, platform noir, arcade shadows, dungeon heroes, and 16-bit dream energy.",
    subsystems: ["PIXEL LEGEND™", "MOON QUEST™", "PLATFORM NOIR™", "RETRO ADVENTURE™", "GAME LEGACY™", "16BIT DREAM™", "DUNGEON HERO™", "MIDNIGHT PLATFORM™", "ARCADE SHADOW™", "QUEST RUNNER™"]
  },
  {
    name: "WISE TOUCH PREDATOR NOIR™",
    category: "Luxury Horror",
    tags: ["predator", "noir", "animal", "red light", "aggressive"],
    vibe: "Hyper-aggressive luxury animal systems focused on glowing eyes, red lighting, shadow predators, and cinematic intimidation.",
    subsystems: ["RED EYE PREDATOR™", "WHITE TIGER NOIR™", "VOID HUNTER™", "BLOODLIGHT™", "SHADOW FANG™", "NIGHT ROAR™", "ALPHA VOID™", "DARK INSTINCT™", "CRIMSON PREDATOR™", "FEAR GAZE™"]
  },
  {
    name: "WISE TOUCH HELL CARTOON™",
    category: "Retro Cartoon",
    tags: ["hell", "devil", "cerberus", "cartoon", "tattoo flash"],
    vibe: "Vintage infernal cartoon mascot systems inspired by Cerberus mythology, tattoo flash, and old-school devil mascots.",
    subsystems: ["CERBERUS TOON™", "HELL HOUND™", "FLAME MASCOT™", "UNDERWORLD PET™", "INFERNO DOODLE™", "DEMON PUP™", "DEVIL STICKER™", "TOON HELLFIRE™", "PUNK CERBERUS™", "FIRE BREATHER™"]
  },
  {
    name: "WISE TOUCH EDITORIAL POP™",
    category: "Fashion / Futurism",
    tags: ["editorial", "magazine", "typography", "fashion", "luxury"],
    vibe: "Magazine-cover systems using clean layouts, giant typography, minimal luxury composition, and fashion-editorial framing.",
    subsystems: ["JUSTICE MAG™", "LOVE COVER™", "FAITH EDITORIAL™", "HOPE MAGAZINE™", "CHROME COVER™", "FUTURE ISSUE™", "LUXURY TYPE™", "COVER NOIR™", "FASHION ARMOR™", "POP EDITION™"]
  },
  {
    name: "WISE TOUCH ANALOG GALAXY™",
    category: "Cosmic / Sci-Fi",
    tags: ["anime", "vhs", "space", "analog", "cel animation"],
    vibe: "Retro anime sci-fi worlds, VHS space-noir, cosmic loneliness, and analog cel animation atmosphere.",
    subsystems: ["VHS COSMOS™", "CELESTIAL NOIR™", "SPACE RELIC™", "RETRO STARFIELD™", "ANALOG VOID™", "MOON STATIC™", "ORBITAL MEMORY™"]
  },
  {
    name: "WISE TOUCH POP CIRCUIT™",
    category: "Pop / Motorsport",
    tags: ["pop art", "racing", "toy", "halftone", "motorsport"],
    vibe: "Pop-art motorsport graphics fused with gallery-toy aesthetics and racing culture.",
    subsystems: ["COMIC GRID™", "RACING POP™", "TOY RACER™", "HALFTONE CIRCUIT™", "POP GARAGE™", "MONDRIAN SPEED™", "COLORBLOCK TURBO™"]
  },
  {
    name: "WISE TOUCH STREET SCRIPT™",
    category: "Graffiti / Typography",
    tags: ["graffiti", "lettering", "handstyle", "emotional", "street poetry"],
    vibe: "Graffiti-lettering emotional typography and handstyle storytelling systems.",
    subsystems: ["EMOTIONAL TAG™", "PAIN SCRIPT™", "WALL POETRY™", "HEARTLETTER™", "STREET CONFESSION™", "SOUL WRITER™", "HANDSTYLE NOIR™"]
  },
  {
    name: "WISE TOUCH BIO SURREAL™",
    category: "Surreal / Horror",
    tags: ["tattoo", "surreal", "anatomy", "nightmare", "occult"],
    vibe: "Tattoo-flash surreal anatomy and symbolic nightmare illustration systems.",
    subsystems: ["FLASH MUTATION™", "ORGAN RELIC™", "DREAM FLESH™", "BONE PARADOX™", "MEDICAL OCCULT™", "INK HORROR™", "SURREAL CADAVER™"]
  },
  {
    name: "WISE TOUCH COSMIC MYTH™",
    category: "Cosmic / Sci-Fi",
    tags: ["anime", "mythology", "ruins", "symbolic", "astral"],
    vibe: "Philosophical anime surrealism mixed with ancient ruins and symbolic entities.",
    subsystems: ["RUIN ORACLE™", "CELESTIAL MONK™", "GOD MACHINE™", "VOID SHRINE™", "PHANTOM TEMPLE™", "ASTRAL RELIC™", "MYTHIC SIGNAL™"]
  },
  {
    name: "WISE TOUCH CYBER PRIMAL™",
    category: "Cyberpunk",
    tags: ["biomechanical", "predator", "tech", "aggressive", "cyber"],
    vibe: "Biomechanical predator aesthetics fused with aggressive tech-horror systems.",
    subsystems: ["DIGITAL PREDATOR™", "WIRED APE™", "MACHINE INSTINCT™", "NEURAL BEAST™", "TECH SAVAGE™", "CYBER GORILLA™", "PRIMAL CIRCUIT™"]
  },
  {
    name: "WISE TOUCH URBAN SLASHER™",
    category: "Horror / Slasher",
    tags: ["tactical", "masked", "slasher", "street", "noir"],
    vibe: "Tactical street-horror noir with masked antiheroes and underground violence aesthetics.",
    subsystems: ["CONCRETE REAPER™", "STREET EXECUTIONER™", "TACTICAL HORROR™", "MASKED NOIR™", "CITY BUTCHER™", "SUBWAY SLASHER™", "ROOFTOP STALKER™"]
  },
  {
    name: "WISE TOUCH VARSITY MASCOT™",
    category: "Retro Cartoon",
    tags: ["americana", "sports", "mascot", "cartoon", "skate"],
    vibe: "Retro Americana sports mascots fused with skate graphics and cartoon branding.",
    subsystems: ["COLLEGE CHAOS™", "RETRO BENCH™", "MASCOT LEAGUE™", "WAFFLE SUNDAY™", "SKATE LETTERMAN™", "CARTOON CAMPUS™", "SIDELINE POP™"]
  },
  {
    name: "WISE TOUCH ACID EXPRESSION™",
    category: "Expressionist / Punk",
    tags: ["acid", "portrait", "punk", "mural", "neo-expressionism"],
    vibe: "Fluorescent neo-expressionist portrait systems with punk mural energy.",
    subsystems: ["TOXIC PORTRAIT™", "MURAL RIOT™", "ACID SOUL™", "STREET EXPRESSION™", "BRUSH RAGE™", "PUNK CANVAS™", "NEON FURY™"]
  },
  {
    name: "WISE TOUCH ANIME FRAME™",
    category: "Anime / Manga",
    tags: ["anime", "manga", "sketch", "soft", "character"],
    vibe: "Soft manga construction systems and emotional anime sketch aesthetics.",
    subsystems: ["MANGA BASE™", "KAWAII SKETCH™", "PILLOW FRAME™", "LINEART SOUL™", "OTAKU DRAFT™", "SOFT POSE™", "SHOUJO BLUEPRINT™", "CHARACTER SHEET™", "DREAM SKETCH™", "CLEAN DRAFT™"]
  },
  {
    name: "WISE TOUCH RETRO RIFF™",
    category: "Retro Cartoon",
    tags: ["metal", "vhs", "cartoon", "comic", "concert"],
    vibe: "Saturday morning cartoon metal fused with VHS comic concert energy.",
    subsystems: ["SATURDAY METAL™", "VHS RIFF™", "COMIC THRASH™", "TOYBOX CHAOS™", "METAL MASCOT™", "CEL SHOCK™", "HALFTONE RIOT™", "NEON HE-METAL™", "ROCKTOBER™", "ANIMATED THRASH™", "SKULL RIFF™", "ACTION VHS™"]
  },
  {
    name: "WISE TOUCH PEDIGREE NOIR™",
    category: "Luxury Horror",
    tags: ["anime", "canine", "gothic", "luxury", "alpha"],
    vibe: "Luxury anime kennel worlds with gothic canine mythology and alpha-beast symbolism.",
    subsystems: ["KENNEL NOIR™", "PEDIGREE KINGDOM™", "DIAMOND BITE™", "GOTHIC K9™", "ALPHA FANG™", "STREET HOUND™", "CASTLE BEAST™", "CEL KENNEL™", "NIGHTBREED™", "GRILL JAW™", "ANIME HOUND™", "ROYAL MUTT™"]
  },
  { name: "WISE TOUCH CINEMATIC NEO-NOIR™", category: "Cinema", tags: ["cinematic", "noir", "gritty", "luxury", "analog"], vibe: "John Wick energy, moody city lighting, gritty luxury crime cinema, teal shadows, warm street glow, and dramatic poster framing.", subsystems: ["MINIMAL NEO-NOIR™", "CLASSIC CINEMATIC™", "STREET PHOTO POSTER™", "INSTAGRAM MOVIE POSTER™", "JOHN WICK ENERGY™", "NIGHT CITY CINEMA™", "TEAL SHADOWS™", "ORANGE STREETLIGHT™"] },
  { name: "WISE TOUCH MINIMAL A24™", category: "Cinema", tags: ["cinematic", "minimalist", "noir"], vibe: "Minimal art-house poster design with quiet tension, negative space, subtle dread, premium typography, and restrained cinematic atmosphere.", subsystems: ["QUIET POSTER™", "NEGATIVE SPACE™", "ART HOUSE STILL™", "MINIMAL DREAD™", "PREMIUM TYPE™", "SUBTLE SYMBOL™"] },
  { name: "WISE TOUCH 1970s GRINDHOUSE™", category: "Cinema", tags: ["cinematic", "analog", "gritty", "horror"], vibe: "Dirty exploitation poster texture, heavy scratches, distressed print, blood red and dirty yellow vintage film energy.", subsystems: ["EXPLOITATION POSTER™", "FILM BURN EDGE™", "DIRTY YELLOW PRINT™", "BLOOD RED HALFTONE™", "ANALOG SCRATCH™", "VHS DAMAGE™", "ROMANTIC EXPLOITATION™", "TRAILER PARK CINEMA™"] },
  { name: "WISE TOUCH EURO CINEMA™", category: "Cinema", tags: ["cinematic", "luxury", "noir"], vibe: "European arthouse cinema styling with refined composition, slow emotion, natural lighting, and sophisticated realism.", subsystems: ["ART FILM NOIR™", "FRENCH STILLNESS™", "ITALIAN SHADOW™", "EUROPEAN NIGHTLIFE™", "MOODY REALISM™", "LUXURY FRAME™"] },
  { name: "WISE TOUCH MONSTER CINEMA™", category: "Horror / Slasher", tags: ["cinematic", "horror", "aggressive", "analog", "gritty"], vibe: "Classic creature-feature cinema with oversized monsters, destruction imagery, cinematic fear, cult-film atmosphere, practical-effects realism, and apocalyptic city chaos.", subsystems: ["CREATURE PANIC™", "GIANT BEAST™", "MONSTER SHADOW™", "CITY DESTRUCTION™", "HORROR TITAN™", "MIDNIGHT CREATURE™", "KAIJU NOIR™", "MUTATION CINEMA™", "CREATURE FEATURE™", "APOCALYPSE MONSTER™", "BIO HORROR TITAN™", "SEWER BEAST™", "MIDNIGHT KAIJU™", "ANALOG MONSTER FEAR™"] },
  { name: "WISE TOUCH BOOTLEG STYLE™", category: "Streetwear", tags: ["analog", "gritty", "fashion", "nostalgic"], vibe: "Oversized 90s bootleg collage layouts with rap, sports, movie, chrome type, VHS glow, and parking-lot tee energy.", subsystems: ["PARKING LOT TEE™", "RAP BOOTLEG™", "SPORTS BOOTLEG™", "MOVIE BOOTLEG™", "OVERSIZED COLLAGE™", "VHS BOOTLEG GLOW™", "CHROME TYPE™", "HALFTONE STARBURST™"] },
  { name: "WISE TOUCH DARK LUXURY HORROR™", category: "Luxury Horror", tags: ["horror", "luxury", "aggressive", "gritty", "fashion"], vibe: "Black void compositions, glossy wet rendering, chrome, ice, fangs, predator iconography, and luxury gothic shine.", subsystems: ["VOID PREDATOR™", "LUXURY HORROR™", "ICE FANG™", "DIAMOND PREDATOR™", "CRYSTAL SLAUGHTER™", "CHROME FANG™", "SHADOW JEWEL™", "GOTHIC PREDATOR™"] },
  { name: "WISE TOUCH VOID PREDATOR™", category: "Luxury Horror", tags: ["horror", "luxury", "noir"], vibe: "Pure black void compositions with predator silhouettes, wet highlights, hidden eyes, and luxury horror emptiness.", subsystems: ["BLACK VOID BEAST™", "HIDDEN EYES™", "DARKNESS BITE™", "VOID JAW™", "SHADOW PREDATOR™", "NO-LIGHT LUXURY™"] },
  { name: "WISE TOUCH DIAMOND PREDATOR™", category: "Luxury Horror", tags: ["horror", "luxury", "aggressive", "fashion"], vibe: "Predator-inspired luxury horror visuals with chrome teeth, black diamonds, glossy wet rendering, icy reflections, and dark streetwear menace.", subsystems: ["DIAMOND FANG™", "LUXURY PREDATOR™", "BLACK ICE™", "VOID JAW™", "CRYSTAL BEAST™", "GOTHIC SHINE™"] },
  { name: "WISE TOUCH CRYSTAL SLAUGHTER™", category: "Luxury Horror", tags: ["horror", "luxury", "aggressive"], vibe: "Sharp crystal textures, violent luxury energy, cinematic gloss, reflective surfaces, and frozen horror atmosphere.", subsystems: ["GLASS FANG™", "FROZEN CHAOS™", "DIAMOND SPLATTER™", "SHATTERED LUXURY™", "ICE GORE™", "CRYSTAL VOID™"] },
  { name: "WISE TOUCH CHROME FANG™", category: "Luxury Horror", tags: ["luxury", "horror", "fashion"], vibe: "Chrome predator luxury with metallic fangs, reflective black surfaces, iced highlights, and dark streetwear menace.", subsystems: ["METALLIC BITE™", "CHROME JAW™", "LIQUID STEEL FANG™", "BLACK CHROME BEAST™", "REFLECTIVE PREDATOR™", "SILVER TOOTH NOIR™"] },
  { name: "WISE TOUCH SHADOW JEWEL™", category: "Luxury Horror", tags: ["luxury", "noir", "fashion"], vibe: "Dark gemstone luxury visuals with shadow-heavy lighting, black diamonds, jewel reflections, and underground elegance.", subsystems: ["BLACK DIAMOND NOIR™", "JEWEL SHADOW™", "ONYX LUXURY™", "DARK GEMSTONE™", "CRYSTAL NIGHTFALL™", "SHADOW PENDANT™"] },
  { name: "WISE TOUCH MASKED SYNDICATE™", category: "Crime / Underworld", tags: ["gritty", "noir", "aggressive", "fashion"], vibe: "Organized street-chaos aesthetics with masked factions, underground power structures, tactical fashion, and criminal luxury atmosphere.", subsystems: ["MASKED RAIDERS™", "TOXIC CARTEL™", "SLASHER SYNDICATE™", "NEON SLAUGHTER™", "HORROR MOTOR CLUB™", "PUMPKIN CHAOS™", "STREET SLASHER™"] },
  { name: "WISE TOUCH STREET ANIMAL UNDERWORLD™", category: "Street Documentary", tags: ["gritty", "graffiti", "cinematic", "aggressive", "noir"], vibe: "Raw street documentary realism with pitbulls, roosters, tattoo-noir armor, alpha energy, urban ritual imagery, and underworld grit.", subsystems: ["TATTOO NOIR™", "CONCRETE JUNGLE™", "UNDERWORLD DOCUMENTARY™", "STREET RITUAL™", "ALPHA KENNEL™", "GHETTO NOIR™", "RAW VICE™", "YAKUZA STREET™", "ORGANIZED CHAOS NOIR™"] },
  { name: "WISE TOUCH TATTOO NOIR™", category: "Street Documentary", tags: ["gritty", "noir", "spiritual"], vibe: "Tattoo armor, black-ink symbolism, Yakuza-inspired body graphics, and raw street portrait atmosphere.", subsystems: ["INK ARMOR™", "BODY SYMBOLISM™", "BLACK INK STREET™", "TATTOO RITUAL™", "YAKUZA INK™", "SKIN CANVAS NOIR™"] },
  { name: "WISE TOUCH STUDIO NOIR™", category: "Music / Lifestyle", tags: ["cinematic", "noir", "luxury", "gritty"], vibe: "Music studio documentary realism, analog flash, luxury trap editorial atmosphere, candid artist photography, and nightlife color grading.", subsystems: ["LUXURY SESSION™", "ANALOG SESSION™", "MIDNIGHT RECORDING™", "VICE DOCUMENTARY™", "AFTER HOURS™", "BOOTH CINEMA™", "TRAP EDITORIAL™", "CANDID NOIR™", "LOWLIGHT LUXURY™"] },
  { name: "WISE TOUCH RENAISSANCE STREET™", category: "Fine Art Remix", tags: ["painterly", "luxury", "graffiti", "cinematic"], vibe: "Renaissance and oil painting remix mixed with luxury streetwear, museum graffiti, cracked canvas, and cultured chaos.", subsystems: ["MUSEUM GRAFFITI™", "CULTURED CHAOS™", "BAROQUE NOIR™", "STREET MASTERPIECE™", "CLASSICAL DRIP™", "CANVAS CRIMINAL™", "FINE ART VANDAL™", "GALLERY UNDERWORLD™", "OIL PAINT HUSTLE™"] },
  { name: "WISE TOUCH SAINTS & SINNERS™", category: "Fine Art Remix", tags: ["spiritual", "painterly", "luxury", "noir"], vibe: "Sacred and profane baroque streetwear imagery, divine lighting, chapel noir, stained glass chaos, and underground theology.", subsystems: ["SACRED CHAOS™", "HOLY UNDERWORLD™", "TRAP GOSPEL™", "DIVINE STREET™", "CHAPEL NOIR™", "RELIC HUSTLE™", "APOCRYPHAL DRIP™"] },
  { name: "WISE TOUCH SACRED CHAOS™", category: "Spiritual / Street", tags: ["spiritual", "surreal", "painterly", "cinematic"], vibe: "Religious-surreal streetwear imagery with sacred/profane contrast, stained glass color, and cinematic divine tension.", subsystems: ["HOLY DISTORTION™", "STAINED GLASS STREET™", "DIVINE DISORDER™", "RELIC NOIR™", "TRAP ALTAR™", "ANGEL STATIC™"] },
  { name: "WISE TOUCH STREET SPIRITUAL™", category: "Spiritual / Street", tags: ["spiritual", "gritty", "cinematic"], vibe: "Urban spirituality mixed with ritual symbolism, candlelight atmosphere, underground faith, and cinematic soul-searching.", subsystems: ["CANDLE NOIR™", "URBAN RITUAL™", "SPIRIT WALK™", "HOLY STREET™", "MYSTIC CITY™", "DIVINE NIGHT™"] },
  { name: "WISE TOUCH FINE ART MASTERS™", category: "Art History / Masters", tags: ["painterly", "surreal", "luxury", "cinematic", "spiritual"], vibe: "Classic fine-art mastery remixed into Wise Touch cinematic language using renaissance anatomy, expressionist chaos, surrealism, and museum-grade composition.", subsystems: ["MICHELANGELO FORM™", "BASQUIAT CHAOS™", "PICASSO FRACTURE™", "VAN GOGH MOTION™", "DALI DREAMSCAPE™", "CARAVAGGIO SHADOW™", "GOYA NIGHTMARE™", "WARHOL POP STATIC™"] },
  { name: "WISE TOUCH NEO EXPRESSIONISM™", category: "Art History / Masters", tags: ["painterly", "graffiti", "aggressive", "surreal"], vibe: "Raw neo-expressionist energy with graffiti emotion, chaotic linework, painterly rebellion, layered symbolism, and underground gallery aesthetics.", subsystems: ["BASQUIAT NOIR™", "GALLERY RIOT™", "PAINT CHAOS™", "CROWN SYMBOLISM™", "RAW CANVAS™", "STREET EXPRESSIONISM™"] },
  { name: "WISE TOUCH RENAISSANCE MASTERY™", category: "Art History / Masters", tags: ["painterly", "luxury", "spiritual", "cinematic"], vibe: "High renaissance craftsmanship with sculptural anatomy, divine composition, heavenly lighting, marble textures, and classical artistic drama.", subsystems: ["MICHELANGELO SCULPT™", "DIVINE ANATOMY™", "MARBLE SHADOW™", "SISTINE CHAOS™", "CLASSICAL FIGURE™", "HEAVENLY PAINT™"] },
  { name: "WISE TOUCH SURREALIST MUSEUM™", category: "Art History / Masters", tags: ["painterly", "surreal", "luxury"], vibe: "Dreamlike surrealist fine-art worlds with melting realities, subconscious symbolism, impossible environments, and museum-level fantasy.", subsystems: ["DALI MELTDOWN™", "SURREAL CANVAS™", "DREAM MUSEUM™", "FLOATING SYMBOLISM™", "SUBCONSCIOUS PAINT™", "TIME DISTORTION™"] },
  { name: "WISE TOUCH IMPRESSIONIST MOTION™", category: "Art History / Masters", tags: ["painterly", "cinematic", "nostalgic"], vibe: "Painterly movement, emotional brushwork, dramatic skies, romantic color palettes, and expressive texture inspired by classical impressionism.", subsystems: ["VAN GOGH STORM™", "PAINTERLY LIGHT™", "EMOTIONAL BRUSH™", "OIL MOTION™", "ROMANTIC SKY™", "TEXTURED CANVAS™"] },
  { name: "WISE TOUCH COSMIC PUNK™", category: "Surreal / Experimental", tags: ["surreal", "nostalgic", "analog", "anime", "graffiti"], vibe: "Alien street iconography, Y2K surrealism, UFO lifestyle, cosmic trash-luxury humor, vaporwave mood, and lo-fi flash.", subsystems: ["UFO STONER™", "ALIEN VACATION™", "COSMIC LOSER™", "GALAXY TRAP™", "SPACE GRAFFITI™", "Y2K COSMOS™", "INTERGALACTIC FLEX™", "RETRO UFO™", "WEIRDWORLD™", "INTERNET COSMIC™", "SUBURBAN UFO™", "MIDNIGHT ALIEN™", "STONER COSMOS™", "VHS ABDUCTION™"] },
  { name: "WISE TOUCH ANALOG DIMENSION™", category: "Surreal / Experimental", tags: ["surreal", "analog", "nostalgic"], vibe: "Psychedelic cartoon surrealism with dream loops, cosmic escapism, vapor trip energy, and lo-fi emotional distortion.", subsystems: ["DREAM LOOP™", "PSYCHEDELIC FLOAT™", "COSMIC DAYDREAM™", "VAPOR TRIP™", "LOFI ESCAPISM™", "ANALOG DREAM PORTAL™"] },
  { name: "WISE TOUCH STREET CREATURE™", category: "Cartoon / Graphic", tags: ["fashion", "surreal", "graffiti"], vibe: "Anthropomorphic wildlife fashion, surreal mascot culture, sneaker-inspired character design, and luxury street-creature aesthetics.", subsystems: ["FASHION MUTANT™", "ANIMAL DRIP™", "SAFARI PUNK™", "LUXURY REPTILE™", "HYPEBEAST CREATURE™", "URBAN WILDLIFE™", "DESIGNER SPECIES™", "MUTANT RUNWAY™"] },
  { name: "WISE TOUCH TOXIC CARTOON™", category: "Cartoon / Graphic", tags: ["horror", "graffiti", "aggressive", "nostalgic"], vibe: "Radioactive slime, gross-out horror cartoons, punk mutation comic energy, arcade horror, and 90s skate graphic chaos.", subsystems: ["RADIOACTIVE SLIME™", "GROSSOUT NOIR™", "MUTATION COMIC™", "VHS TOXIN™", "TOXIC MELTDOWN™", "ARCADE HORROR™", "SLIMECORE™", "PUNK MUTATION™"] },
  { name: "WISE TOUCH STREET DOODLE VECTOR™", category: "Cartoon / Graphic", tags: ["graffiti", "nostalgic", "aggressive"], vibe: "Eyeball mascot graffiti cartoons, thick vector outlines, skate-punk graphics, smoke typography, and sticker-ready chaos.", subsystems: ["EYEBALL MUTANT™", "GRAFFITI MASCOT™", "SKATE HORROR™", "STICKER PUNK™", "COMIC SLIME™", "VECTOR CHAOS™"] },
  { name: "WISE TOUCH RETRO CARTOON CHAOS™", category: "Retro Cartoon / Nostalgia", tags: ["nostalgic", "analog", "anime"], vibe: "Classic Saturday morning cartoon energy with gritty Wise Touch texture, vintage animation chaos, bold outlines, and nostalgic pop-culture atmosphere.", subsystems: ["SATURDAY MORNING™", "RETRO CEL ANIMATION™", "90s CARTOON STATIC™", "VHS CARTOON™", "TOON CHAOS™", "NOSTALGIA OVERLOAD™"] },
  { name: "WISE TOUCH RUBBER HOSE NOIR™", category: "Retro Cartoon", tags: ["nostalgic", "noir", "analog"], vibe: "1930s rubber hose cartoon language fused with dark noir atmosphere, ink surrealism, jazz-age chaos, and creepy smiling mascots.", subsystems: ["INK CHAOS™", "VINTAGE TOON™", "JAZZ CARTOON™", "BLACK INK HORROR™", "RUBBER LIMB™", "OLD FILM TOON™"] },
  { name: "WISE TOUCH STREET TOON CLASSICS™", category: "Retro Cartoon", tags: ["nostalgic", "graffiti", "fashion"], vibe: "Old-school cartoon energy remixed with graffiti, hip-hop culture, oversized streetwear graphics, and urban parody aesthetics.", subsystems: ["BOOMBOX TOON™", "GRAFFITI CARTOON™", "BLOCK PARTY TOON™", "RETRO STREET MASCOT™", "90s HIP-HOP TOON™", "CITY TOON CHAOS™"] },
  { name: "WISE TOUCH VHS KIDS HORROR™", category: "Retro Cartoon", tags: ["nostalgic", "horror", "analog"], vibe: "Distorted childhood cartoon nostalgia with eerie VHS textures, creepy mascot energy, analog fear, and haunted animation atmosphere.", subsystems: ["BROKEN SATURDAY MORNING™", "HAUNTED TOON™", "CARTOON NIGHTMARE™", "STATIC KIDS TV™", "MELTED ANIMATION™", "ANALOG TOON FEAR™"] },
  { name: "WISE TOUCH ANIME RETRO WAVE™", category: "Anime / Manga", tags: ["anime", "nostalgic", "analog", "surreal"], vibe: "80s and 90s anime nostalgia mixed with neon city lighting, VHS degradation, retro-futurism, and emotional cartoon realism.", subsystems: ["RETRO ANIME™", "CITY POP ANIMATION™", "VHS ANIME™", "MIDNIGHT TOKYO ANIME™", "NEON MANGA™", "ANALOG ANIME DREAM™"] },
  { name: "WISE TOUCH AFTER SCHOOL CHAOS™", category: "Retro Cartoon", tags: ["nostalgic", "graffiti", "surreal"], vibe: "Chaotic after-school cartoon comedy with exaggerated expressions, colorful mayhem, nostalgic TV energy, and playful Wise Touch distortion.", subsystems: ["DETENTION MAYHEM™", "CAFETERIA CHAOS™", "BACKPACK GRAFFITI™", "PLAYGROUND RIOT™", "TOON MISCHIEF™", "90s TV MADNESS™"] },
  { name: "WISE TOUCH TECHWEAR NOIR™", category: "Cyberpunk / Streetwear", tags: ["cyberpunk", "fashion", "noir", "cinematic", "gritty"], vibe: "Tactical techwear silhouettes, cyberpunk noir lighting, urban surveillance atmosphere, futuristic street-ops energy, and black utility detail.", subsystems: ["TACTICAL SHADOW™", "CYBER NOIR™", "DIGITAL RAIN™", "SURVEILLANCE CORE™", "BLACKOUT OPS™", "NEON UTILITY™"] },
  { name: "WISE TOUCH DIGITAL APOCALYPSE™", category: "Cyberpunk / Dystopian", tags: ["cyberpunk", "gritty", "analog", "horror"], vibe: "Collapsed digital society aesthetics with glitch overload, surveillance decay, corrupted neon systems, and end-of-network chaos.", subsystems: ["GLITCH COLLAPSE™", "CORRUPTED SIGNAL™", "SURVEILLANCE RUIN™", "DATA WASTELAND™", "NEON SYSTEM FAILURE™", "DIGITAL ENDGAME™"] },
  { name: "WISE TOUCH CORPORATE DYSTOPIA™", category: "Cyberpunk / Dystopian", tags: ["cyberpunk", "luxury", "noir"], vibe: "Corporate-controlled futuristic decay with sterile luxury towers, surveillance capitalism, neon bureaucracy, and executive oppression.", subsystems: ["EXECUTIVE NOIR™", "SURVEILLANCE CAPITAL™", "NEON BOARDROOM™", "MEGACORP SHADOW™", "LUXURY OPPRESSION™", "DIGITAL TYRANT™"] },
  { name: "WISE TOUCH RAW SPORTS DOCUMENTARY™", category: "Sports / Documentary", tags: ["cinematic", "gritty", "analog"], vibe: "Raw sideline realism, flash photography, sweat, motion blur, emotional athletic storytelling, and gritty sports cinema.", subsystems: ["SIDELINE CHAOS™", "LOCKER ROOM NOIR™", "FLASH SPORTS™", "GRIT ATHLETICS™", "COURTSIDE REALISM™", "GAME NIGHT CINEMA™"] },
  { name: "WISE TOUCH COMBAT SPORTS™", category: "Sports / Combat", tags: ["aggressive", "cinematic", "gritty"], vibe: "Fight-camp realism, brutal training atmosphere, cinematic violence, championship lighting, and warrior mentality.", subsystems: ["FIGHT CAMP™", "RING WAR™", "BLOODSPORT CINEMA™", "CHAMPION MENTALITY™", "TRAINING NIGHTMARE™", "WARRIOR DOCUMENTARY™"] },
  { name: "WISE TOUCH STREET RACING TOKYO™", category: "Automotive / Racing", tags: ["cyberpunk", "cinematic", "anime", "fashion"], vibe: "Midnight Tokyo street racing with neon reflections, tuner aggression, cinematic speed, drift culture, and underground car-meet energy.", subsystems: ["TOKYO DRIFT NOIR™", "MIDNIGHT EXPRESSWAY™", "NEON RACER™", "SHIBUYA DRIFT™", "TUNER CHAOS™", "STREET SPEED™"] },
  { name: "WISE TOUCH STREET TOON TUNER™", category: "Automotive / Cartoon", tags: ["anime", "nostalgic", "surreal"], vibe: "Cartoon tuner-car culture with glossy automotive lifestyle, anime racing energy, suburban satire, and neon underglow.", subsystems: ["SUBURBAN DRIFT™", "CARTOON GARAGE™", "SIMPSONS STREET™", "ANIME MOTOR CLUB™", "TUNER NOIR™", "HYPEBEAST RACER™", "NEON COMMUTER™"] },
  { name: "WISE TOUCH POP NOIR™", category: "Pop Art / Crime", tags: ["noir", "nostalgic", "graffiti"], vibe: "Vintage comic crime parody mixed with propaganda poster layouts, halftone textures, antihero iconography, and outlaw satire.", subsystems: ["CRIME ICON™", "PULP PROPAGANDA™", "ANTIHERO PRINT™", "COMIC CRIMINAL™", "SATIRICAL STREET™", "VINTAGE OUTLAW™", "POSTER RIOT™"] },
  { name: "WISE TOUCH SPLATTER PANEL™", category: "Comic / Horror", tags: ["horror", "aggressive", "graffiti"], vibe: "Hyper-violent indie comic cover energy with toxic splash compositions, kinetic movement, mutation horror, and cinematic action chaos.", subsystems: ["BIO HORROR COMIC™", "MONSTER RIOT™", "KINETIC MAYHEM™", "TOXIC SPLASH™", "COMIC ANNIHILATION™", "VOID CREATURE™", "CHAOS PANEL™"] },
  { name: "WISE TOUCH METAL HORROR™", category: "Horror / Music", tags: ["horror", "aggressive", "gritty"], vibe: "Heavy metal darkness with chrome spikes, horror-stage energy, aggressive textures, and gothic destruction.", subsystems: ["SPIKE CHAOS™", "BLACK METAL BLOOD™", "CHAIN RIOT™", "GOTHIC SCREAM™", "MOSH PIT HORROR™", "DEMON STAGE™"] },
  { name: "WISE TOUCH PUNK RIOT™", category: "Punk / Street", tags: ["aggressive", "gritty", "graffiti"], vibe: "DIY rebellion, street protest chaos, ripped textures, underground punk attitude, and anti-system visual energy.", subsystems: ["ANARCHY POSTER™", "RIOT STREET™", "DIY CHAOS™", "PUNK COLLISION™", "UNDERGROUND REBELLION™", "NO FUTURE™"] },
  { name: "WISE TOUCH DIRTY SOUTH™", category: "Regional / Music", tags: ["gritty", "luxury", "cinematic"], vibe: "Southern street culture with chrome candy paint, trap realism, heatwave atmosphere, and gritty nightlife storytelling.", subsystems: ["TRAP PARKING LOT™", "SOUTHERN CHROME™", "HEATWAVE NOIR™", "DIRTY CITY LIGHTS™", "SLAB CULTURE™", "TRAP GAS STATION™"] },
  { name: "WISE TOUCH TOKYO LUXURY™", category: "Luxury / International", tags: ["luxury", "cyberpunk", "fashion", "noir"], vibe: "Tokyo nightlife elegance with neon reflections, designer fashion, cyber-luxury atmosphere, and premium street realism.", subsystems: ["TOKYO AFTER HOURS™", "SHIBUYA LUXURY™", "NEON ELEGANCE™", "CYBER FASHION™", "JAPAN NOIR™", "MIDNIGHT TOKYO™"] },
  { name: "WISE TOUCH RUNWAY FUTURE™", category: "Fashion / Futurism", tags: ["fashion", "luxury", "cyberpunk"], vibe: "Avant-garde fashion futurism with glossy silhouettes, runway drama, conceptual luxury, and high-fashion sci-fi energy.", subsystems: ["FUTURE MODEL™", "CYBER RUNWAY™", "GLOSS FASHION™", "AVANT NOIR™", "CONCEPT LUXURY™", "FASHION FUTURISM™"] },
  { name: "WISE TOUCH STREET GOTHIC™", category: "Street / Gothic", tags: ["noir", "fashion", "horror"], vibe: "Dark cathedral streetwear visuals with gothic lettering, black fabrics, moody lighting, and underground elegance.", subsystems: ["GOTHIC LETTERING™", "BLACK CHAPEL™", "STREET CATHEDRAL™", "DARK SAINT™", "FUNERAL DRIP™", "NOIR CHOIR™"] },
  { name: "WISE TOUCH INDUSTRIAL STREET™", category: "Industrial / Street", tags: ["gritty", "noir", "cinematic"], vibe: "Factory textures, steel environments, mechanical grit, urban infrastructure, and cold industrial realism.", subsystems: ["FACTORY NOIR™", "STEEL CHAOS™", "MECHANICAL STREET™", "CONCRETE MACHINE™", "URBAN INDUSTRY™", "PIPELINE SHADOW™"] },
  { name: "WISE TOUCH DREAM HORROR™", category: "Surreal / Horror", tags: ["surreal", "horror", "cinematic"], vibe: "Dreamlike nightmare imagery with surreal distortion, subconscious symbolism, eerie softness, and cinematic terror.", subsystems: ["NIGHTMARE FOG™", "SUBCONSCIOUS CHAOS™", "DREAM ENTITY™", "SLEEP PARALYSIS™", "SOFT HORROR™", "DISTORTED REALITY™"] },
  { name: "WISE TOUCH ABSTRACT CHAOS™", category: "Surreal / Experimental", tags: ["surreal", "aggressive", "analog"], vibe: "Experimental visual destruction with fragmented composition, emotional abstraction, layered texture, and chaotic motion.", subsystems: ["FRACTURE COLLAGE™", "VISUAL STATIC™", "EMOTIONAL DISTORTION™", "BROKEN SIGNAL™", "TEXTURE OVERLOAD™", "ABSTRACT RIOT™"] },
  { name: "WISE TOUCH RETRO FUTURISM™", category: "Cosmic / Sci-Fi", tags: ["nostalgic", "cyberpunk", "analog"], vibe: "Vintage visions of the future with chrome optimism, analog sci-fi, retro technology, and nostalgic futurist design.", subsystems: ["ANALOG FUTURE™", "RETRO SPACE AGE™", "CHROME TOMORROW™", "VINTAGE SCI-FI™", "FUTURE PAST™", "NEON TOMORROW™"] },
  { name: "WISE TOUCH DESERT OUTLAW™", category: "Western / Outlaw", tags: ["gritty", "cinematic", "noir"], vibe: "Dusty outlaw cinema with desert heat, criminal nomad energy, vintage western grit, and cinematic isolation.", subsystems: ["DUST STORM™", "OUTLAW NOIR™", "DESERT HEAT™", "WASTELAND RIDER™", "SUNSET BANDIT™", "WESTERN CHAOS™"] },
  { name: "WISE TOUCH OCEANIC CHAOS™", category: "Oceanic / Surreal", tags: ["surreal", "cinematic", "horror"], vibe: "Stormy ocean atmosphere with aquatic surrealism, deep-sea darkness, cinematic water textures, and chaotic tides.", subsystems: ["SEA STORM™", "ABYSSAL NOIR™", "WAVE CHAOS™", "DARK TIDE™", "OCEANIC NIGHTMARE™", "SALTWATER CINEMA™"] },
  { name: "WISE TOUCH ANCIENT FUTURE™", category: "Cosmic / Sci-Fi", tags: ["spiritual", "cyberpunk", "surreal"], vibe: "Ancient civilization symbolism fused with futuristic technology, sacred geometry, cosmic history, and sci-fi mythology.", subsystems: ["FUTURE RELIC™", "COSMIC TEMPLE™", "ANCIENT TECH™", "PHARAOH CYBER™", "SACRED MACHINE™", "TIME COLLISION™"] },
  { name: "WISE TOUCH CHILDHOOD NIGHTMARE™", category: "Horror / Slasher", tags: ["horror", "nostalgic", "surreal", "analog"], vibe: "Distorted childhood nostalgia with eerie innocence, analog fear, haunted toys, and dreamlike psychological horror.", subsystems: ["HAUNTED TOY™", "BROKEN CARTOON™", "NOSTALGIA FEAR™", "PLAYROOM HORROR™", "VHS NIGHTMARE™", "CHILDHOOD STATIC™"] },
  { name: "WISE TOUCH LUXURY CASINO NOIR™", category: "Luxury / Crime", tags: ["luxury", "noir", "cinematic"], vibe: "High-roller crime cinema with casino lighting, luxury corruption, velvet darkness, and elite criminal atmosphere.", subsystems: ["CASINO SHADOW™", "HIGH ROLLER™", "VELVET NOIR™", "CRIMINAL LUXURY™", "MIDNIGHT CASINO™", "GOLD ROOM™"] },
  { name: "WISE TOUCH SCI-FI WAR™", category: "Cosmic / Sci-Fi", tags: ["cyberpunk", "aggressive", "cinematic"], vibe: "Futuristic warfare aesthetics with armored soldiers, dystopian battlefields, cinematic destruction, and sci-fi conflict.", subsystems: ["MECH WAR™", "BATTLEFIELD 2099™", "CYBER SOLDIER™", "APOCALYPSE UNIT™", "FUTURE COMBAT™", "WAR MACHINE™"] },
  { name: "WISE TOUCH DARK FAIRYTALE™", category: "Horror / Slasher", tags: ["horror", "surreal", "painterly"], vibe: "Twisted fairytale worlds with gothic fantasy, cursed forests, storybook horror, and cinematic mythological darkness.", subsystems: ["CURSED FOREST™", "FAIRYTALE NOIR™", "WITCHING HOUR™", "DARK KINGDOM™", "STORYBOOK HORROR™", "MYTHIC SHADOW™"] }
];

const CATEGORY_COLORS = {
  Cinema: "from-cyan-500/20 to-blue-500/10",
  Streetwear: "from-yellow-500/20 to-orange-500/10",
  "Horror / Slasher": "from-red-500/20 to-orange-500/10",
  "Luxury Horror": "from-red-500/20 to-zinc-500/10",
  "Crime / Underworld": "from-red-500/20 to-yellow-500/10",
  "Street Documentary": "from-orange-500/20 to-zinc-500/10",
  "Music / Lifestyle": "from-purple-500/20 to-orange-500/10",
  "Fine Art Remix": "from-amber-500/20 to-yellow-500/10",
  "Art History / Masters": "from-amber-500/20 to-purple-500/10",
  "Spiritual / Street": "from-yellow-500/20 to-white/5",
  "Surreal / Experimental": "from-fuchsia-500/20 to-violet-500/10",
  "Cartoon / Graphic": "from-green-500/20 to-yellow-500/10",
  "Retro Cartoon": "from-pink-500/20 to-yellow-500/10",
  "Anime / Manga": "from-cyan-500/20 to-violet-500/10",
  Cyberpunk: "from-cyan-500/20 to-emerald-500/10",
  "Sports / Documentary": "from-blue-500/20 to-yellow-500/10",
  "Sports / Combat": "from-red-500/20 to-orange-500/10",
  "Automotive / Racing": "from-cyan-500/20 to-red-500/10",
  "Fantasy / Horror": "from-purple-500/20 to-red-500/10",
  "Automotive / Cartoon": "from-cyan-500/20 to-yellow-500/10",
  "Pop Art / Crime": "from-pink-500/20 to-yellow-500/10",
  "Comic / Horror": "from-red-500/20 to-green-500/10",
  "Horror / Music": "from-red-500/20 to-zinc-500/10",
  "Punk / Street": "from-rose-500/20 to-yellow-500/10",
  "Regional / Music": "from-orange-500/20 to-yellow-500/10",
  "Luxury / International": "from-cyan-500/20 to-purple-500/10",
  "Fashion / Futurism": "from-violet-500/20 to-cyan-500/10",
  "Street / Gothic": "from-zinc-500/20 to-purple-500/10",
  "Industrial / Street": "from-zinc-500/20 to-orange-500/10",
  "Surreal / Horror": "from-purple-500/20 to-red-500/10",
  "Abstract / Experimental": "from-fuchsia-500/20 to-cyan-500/10",
  "Retro / Futurism": "from-cyan-500/20 to-yellow-500/10",
  "Western / Outlaw": "from-orange-500/20 to-red-500/10",
  "Oceanic / Surreal": "from-blue-500/20 to-cyan-500/10",
  "Ancient / Futurism": "from-amber-500/20 to-cyan-500/10",
  "Psychological Horror": "from-red-500/20 to-purple-500/10",
  "Luxury / Crime": "from-yellow-500/20 to-red-500/10",
  "Cosmic / Sci-Fi": "from-cyan-500/20 to-violet-500/10",
  default: "from-zinc-500/20 to-zinc-700/10",
};

const FINE_ART_DESCRIPTIONS = {
  "MICHELANGELO FORM™": "Renaissance anatomy mastery with sculptural human forms, divine proportions, marble realism, and dramatic ceiling-painting energy.",
  "BASQUIAT CHAOS™": "Raw neo-expressionist graffiti emotion with frantic linework, symbolic crowns, rough paint textures, and rebellious gallery energy.",
  "PICASSO FRACTURE™": "Cubist distortion using fragmented perspectives, abstract facial structure, geometric breakdowns, and layered visual tension.",
  "DALI DREAMSCAPE™": "Melting surrealist dream imagery with impossible landscapes, subconscious symbolism, floating objects, and distorted reality.",
};

function subsystemDescription(subsystem, system) {
  if (FINE_ART_DESCRIPTIONS[subsystem]) return FINE_ART_DESCRIPTIONS[subsystem];
  return `${subsystem.replace("™", "")} — ${system.vibe}`;
}

function buildPrompt(system, subsystem = "") {
  const core = subsystem ? subsystemDescription(subsystem, system) : system.vibe;
  return [
    "WISE TOUCH PROMPT",
    "",
    `System: ${system.name}`,
    subsystem ? `Subsystem: ${subsystem}` : "",
    "",
    "CORE SYSTEM PROMPT:",
    core,
    "",
    "STYLE INSTRUCTIONS:",
    "Heavy cinematic atmosphere, premium composition, layered textures, analog realism, gritty detail, cinematic lighting, strong visual hierarchy, and high-end streetwear/editorial energy.",
    "",
    "TEXTURE RULES:",
    "35mm film grain, halftone print texture, dust, scratches, film burn edges, subtle chromatic aberration, distressed analog wear, cinematic contrast.",
    "",
    "COMPOSITION RULES:",
    "Preserve the important subject, pose, identity, clothing structure, product shape, and visual intent unless a full transformation is requested.",
    "",
    "OUTPUT GOAL:",
    "Create a fully realized Wise Touch cinematic visual using the system language above."
  ].filter(Boolean).join("\n");
}

function buildHybridPrompt(slots) {
  const activeSlots = slots.filter((slot) => slot.system && slot.weight > 0);
  const totalWeight = activeSlots.reduce((sum, slot) => sum + slot.weight, 0);
  const systemText = activeSlots
    .map((slot, index) => [
      `System ${index + 1}: ${slot.system.name} (${slot.weight}% influence)`,
      "VISUAL DNA:",
      slot.system.vibe
    ].join("\n"))
    .join("\n\n");

  return [
    "HYBRID WISE TOUCH SYSTEM™",
    "",
    `TOTAL INFLUENCE: ${totalWeight}%`,
    "",
    systemText,
    "",
    "STYLE INSTRUCTIONS:",
    "Blend all selected Wise Touch systems together into one cinematic visual direction. The highest percentage system should dominate atmosphere, lighting, composition, texture, cinematic energy, and emotional tone. Lower percentage systems should act as supporting visual DNA layers.",
    "",
    "TEXTURE RULES:",
    "35mm film grain, halftone print texture, analog wear, dust, scratches, film burn edges, subtle chromatic aberration, distressed realism, cinematic contrast.",
    "",
    "OUTPUT GOAL:",
    "Create a fully realized Wise Touch hybrid cinematic visual using all selected systems with correctly weighted influence."
  ].join("\n");
}

const FAVORITES_KEY = "wt-favorites";

function readFavorites() {
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFavorites(value) {
  try {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(value));
  } catch {}
}

export default function App() {
  const [tab, setTab] = useState("directory");
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [manualCopyText, setManualCopyText] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [favorites, setFavorites] = useState(() => readFavorites());
  const [meterSlots, setMeterSlots] = useState([
    { system: DEFAULT_SYSTEMS[0], weight: 40 },
    { system: DEFAULT_SYSTEMS[1], weight: 30 },
    { system: DEFAULT_SYSTEMS[2], weight: 20 },
    { system: DEFAULT_SYSTEMS[3], weight: 10 },
  ]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedSystemForImage, setSelectedSystemForImage] = useState(DEFAULT_SYSTEMS[0]);
  const [transformedImage, setTransformedImage] = useState(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformError, setTransformError] = useState("");

  const categories = useMemo(() => ["ALL", ...new Set(DEFAULT_SYSTEMS.map((s) => s.category))], []);
  const subsystemTotal = DEFAULT_SYSTEMS.reduce((sum, s) => sum + s.subsystems.length, 0);
  const meterTotal = meterSlots.reduce((sum, slot) => sum + slot.weight, 0);
  const meterReady = meterTotal === 100;

  const filteredSystems = useMemo(() => {
    const q = query.toLowerCase();
    return DEFAULT_SYSTEMS.filter((system) => {
      const searchable = `${system.name} ${system.category} ${system.vibe} ${(system.tags || []).join(" ")} ${system.subsystems.join(" ")}`.toLowerCase();
      return searchable.includes(q) && (categoryFilter === "ALL" || system.category === categoryFilter);
    });
  }, [query, categoryFilter]);

  const groupedSystems = useMemo(() => {
    return filteredSystems.reduce((groups, system) => {
      if (!groups[system.category]) groups[system.category] = [];
      groups[system.category].push(system);
      return groups;
    }, {});
  }, [filteredSystems]);

  const favoriteSystems = DEFAULT_SYSTEMS.filter((system) => favorites.includes(system.name));

  const copyText = async (text) => {
    setManualCopyText(text);
    setCopyStatus("Prompt generated. Select from the preview if it does not copy automatically.");
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch {}
    if (!copied) {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        copied = document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch {}
    }
    setCopyStatus(copied ? "Copied to clipboard." : "Prompt generated. Select it from the preview and press Ctrl+C.");
  };

  const toggleFavorite = (name) => {
    const next = favorites.includes(name) ? favorites.filter((item) => item !== name) : [...favorites, name];
    setFavorites(next);
    saveFavorites(next);
  };

  const updateMeterSlot = (index, patch) => {
    setMeterSlots((current) => current.map((slot, i) => (i === index ? { ...slot, ...patch } : slot)));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result);
      setTransformedImage(null);
      setTransformError("");
    };
    reader.readAsDataURL(file);
  };

  const transformImage = async () => {
    if (!uploadedImage || !selectedSystemForImage) return;
    setIsTransforming(true);
    setTransformError("");
    try {
      const prompt = buildPrompt(selectedSystemForImage);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 minute timeout for Ollama

      const response = await fetch("/api/transform-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData: uploadedImage, prompt }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }
      const data = await response.json();
      setTransformedImage(data.imageUrl);
    } catch (err) {
      const message = err.name === 'AbortError'
        ? "Request took too long - Ollama is processing (this can take 30-60 seconds)"
        : err.message || "Failed to transform image";
      setTransformError(message);
      console.error("Transform error:", err);
    } finally {
      setIsTransforming(false);
    }
  };

  if (selectedSystem) {
    return (
      <main className="min-h-screen bg-black p-6 text-white">
        <div className="mx-auto max-w-7xl">
          <button onClick={() => setSelectedSystem(null)} className="mb-6 rounded-2xl border border-zinc-700 px-4 py-3 font-bold text-zinc-300">← Back</button>
          {manualCopyText && (
            <div className="mb-6 rounded-2xl border border-yellow-500/30 bg-zinc-950 p-4">
              <div className="mb-3 text-sm font-black text-yellow-300">{copyStatus}</div>
              <textarea value={manualCopyText} readOnly onFocus={(e) => e.currentTarget.select()} onClick={(e) => e.currentTarget.select()} className="h-60 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-sm text-zinc-200" />
            </div>
          )}
          <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8">
            <div className="text-sm font-black uppercase tracking-widest text-yellow-300">{selectedSystem.category}</div>
            <h1 className="mt-3 text-4xl font-black">{selectedSystem.name}</h1>
            <p className="mt-4 max-w-3xl text-zinc-400">{selectedSystem.vibe}</p>
          </section>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {selectedSystem.subsystems.map((subsystem) => (
              <div key={subsystem} className="rounded-3xl border border-zinc-800 bg-black/50 p-5">
                <h2 className="text-xl font-black">{subsystem}</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{subsystemDescription(subsystem, selectedSystem)}</p>
                <button type="button" onClick={() => copyText(buildPrompt(selectedSystem, subsystem))} className="mt-4 rounded-2xl bg-yellow-500 px-4 py-3 font-black text-black">Copy Prompt</button>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-7xl">
        {manualCopyText && (
          <div className="mb-6 rounded-2xl border border-yellow-500/30 bg-zinc-950 p-4">
            <div className="mb-3 text-sm font-black text-yellow-300">{copyStatus}</div>
            <textarea value={manualCopyText} readOnly onFocus={(e) => e.currentTarget.select()} onClick={(e) => e.currentTarget.select()} className="h-60 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-sm text-zinc-200" />
          </div>
        )}
        <section className="rounded-[2rem] border border-yellow-500/20 bg-zinc-950 p-8">
          <div className="flex items-center gap-4">
            <Target className="text-yellow-300" size={36} />
            <div>
              <div className="text-xs uppercase tracking-[0.35em] text-yellow-300/70">Wise Touch</div>
              <h1 className="text-4xl font-black">WISE TOUCH PROMPT SHOP™</h1>
            </div>
          </div>
          <p className="mt-5 max-w-3xl text-zinc-400">Clean consolidated WT Master with locked systems, subsystems, categories, prompt copy, favorites, and 4-system meter.</p>
        </section>

        <div className="my-6 flex flex-wrap gap-3 rounded-3xl border border-zinc-800 bg-zinc-950/80 p-3">
          {["directory", "favorites", "meter", "transform"].map((item) => (
            <button key={item} onClick={() => setTab(item)} className={`rounded-2xl px-5 py-3 text-sm font-black capitalize ${tab === item ? "bg-yellow-500 text-black" : "bg-black/40 text-zinc-400"}`}>{item === "meter" ? "Hybrid Builder" : item === "transform" ? "Image Transform" : item}</button>
          ))}
        </div>

        {tab === "directory" && (
          <>
            <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5"><div className="text-xs uppercase tracking-widest text-zinc-500">Systems</div><div className="mt-2 text-4xl font-black text-yellow-300">{DEFAULT_SYSTEMS.length}</div></div>
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5"><div className="text-xs uppercase tracking-widest text-zinc-500">Subsystems</div><div className="mt-2 text-4xl font-black text-yellow-300">{subsystemTotal}</div></div>
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5"><div className="text-xs uppercase tracking-widest text-zinc-500">Favorites</div><div className="mt-2 text-4xl font-black text-yellow-300">{favorites.length}</div></div>
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5"><div className="text-xs uppercase tracking-widest text-zinc-500">Categories</div><div className="mt-2 text-4xl font-black text-yellow-300">{categories.length - 1}</div></div>
            </div>

            <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto]">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search systems..." className="h-14 rounded-2xl border border-zinc-800 bg-black/50 px-4 text-white" />
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="h-14 rounded-2xl border border-zinc-800 bg-black/50 px-4 text-white">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-8">
              {Object.entries(groupedSystems).map(([category, systems]) => (
                <section key={category}>
                  <h2 className="mb-4 text-3xl font-black text-yellow-300">{category} <span className="text-sm text-zinc-500">({systems.length} systems)</span></h2>
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {systems.map((system) => (
                      <div key={system.name} className={`rounded-[2rem] border border-zinc-800 bg-gradient-to-br ${CATEGORY_COLORS[system.category] || CATEGORY_COLORS.default} p-5`}>
                        <button onClick={() => setSelectedSystem(system)} className="w-full text-left">
                          <div className="text-xs font-black uppercase tracking-widest text-yellow-300">{system.category}</div>
                          <h3 className="mt-3 text-2xl font-black">{system.name}</h3>
                          <p className="mt-4 text-sm leading-6 text-zinc-400">{system.vibe}</p>
                        </button>
                        <div className="mt-5 flex gap-3">
                          <button type="button" onClick={() => toggleFavorite(system.name)} className={`rounded-2xl border px-4 py-3 font-black ${favorites.includes(system.name) ? "border-yellow-400 bg-yellow-500 text-black" : "border-zinc-700 text-zinc-300"}`}>★</button>
                          <button type="button" onClick={() => copyText(buildPrompt(system))} className="flex-1 rounded-2xl bg-yellow-500 px-4 py-3 font-black text-black">Copy Main Prompt</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </>
        )}

        {tab === "favorites" && (
          <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8">
            <h2 className="text-4xl font-black">Favorites</h2>
            {favoriteSystems.length === 0 ? (
              <div className="mt-6 rounded-3xl border border-zinc-800 bg-black/40 p-6 text-zinc-400">No favorites saved yet.</div>
            ) : (
              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {favoriteSystems.map((system) => (
                  <div key={system.name} className="rounded-3xl border border-zinc-800 bg-black/50 p-5">
                    <div className="text-xs font-black uppercase tracking-widest text-yellow-300">{system.category}</div>
                    <h3 className="mt-3 text-xl font-black">{system.name}</h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">{system.vibe}</p>
                    <div className="mt-5 flex gap-3">
                      <button type="button" onClick={() => toggleFavorite(system.name)} className="rounded-2xl border border-yellow-400 bg-yellow-500 px-4 py-3 font-black text-black">★</button>
                      <button type="button" onClick={() => copyText(buildPrompt(system))} className="flex-1 rounded-2xl bg-yellow-500 px-4 py-3 font-black text-black">Copy Prompt</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {tab === "meter" && (
          <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8">
            <div className="mb-4 flex items-center gap-3"><SlidersHorizontal className="text-yellow-300" /><h2 className="text-4xl font-black">Hybrid Builder</h2></div>
            <div className="grid gap-5 md:grid-cols-2">
              {meterSlots.map((slot, index) => (
                <div key={index} className="rounded-3xl border border-zinc-800 bg-black/40 p-5">
                  <div className="mb-2 text-sm font-black uppercase tracking-widest text-zinc-500">System {index + 1}</div>
                  <select value={slot.system.name} onChange={(e) => { const next = DEFAULT_SYSTEMS.find((s) => s.name === e.target.value); if (next) updateMeterSlot(index, { system: next }); }} className="h-14 w-full rounded-2xl border border-zinc-800 bg-black/50 px-4 text-white">
                    {DEFAULT_SYSTEMS.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
                  </select>
                  <div className="mt-4 flex justify-between font-black"><span className="text-zinc-500">Influence</span><span className="text-yellow-300">{slot.weight}%</span></div>
                  <input type="range" min="0" max="100" value={slot.weight} onChange={(e) => updateMeterSlot(index, { weight: Number(e.target.value) })} className="mt-3 w-full" />
                </div>
              ))}
            </div>
            <div className={`mt-8 text-5xl font-black ${meterReady ? "text-yellow-300" : "text-red-400"}`}>{meterTotal}%</div>
            <button type="button" disabled={!meterReady} onClick={() => meterReady && copyText(buildHybridPrompt(meterSlots))} className={`mt-6 w-full rounded-2xl py-4 font-black ${meterReady ? "bg-yellow-500 text-black" : "bg-zinc-800 text-zinc-500"}`}>{meterReady ? "Copy 4-System Hybrid Prompt" : "Set Total To 100% To Copy"}</button>
          </section>
        )}

        {tab === "transform" && (
          <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8">
            <div className="mb-6 flex items-center gap-3"><Upload className="text-yellow-300" size={36} /><h2 className="text-4xl font-black">Image Transformer</h2></div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-zinc-800 bg-black/40 p-6">
                <h3 className="mb-4 text-xl font-black text-yellow-300">Upload Image</h3>
                <div className="mb-4 rounded-2xl border-2 border-dashed border-zinc-700 p-6 text-center">
                  {uploadedImage ? (
                    <div className="space-y-3">
                      <img src={uploadedImage} alt="Uploaded" className="mx-auto max-h-48 rounded-2xl" />
                      <label className="block">
                        <span className="rounded-2xl bg-yellow-500 px-4 py-2 font-black text-black cursor-pointer">Change Image</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    </div>
                  ) : (
                    <label className="block cursor-pointer">
                      <div className="space-y-3 text-zinc-400">
                        <Upload size={32} className="mx-auto opacity-50" />
                        <div className="font-black">Click to upload or drag image</div>
                        <div className="text-sm">PNG, JPG, GIF up to 10MB</div>
                      </div>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
                {uploadedImage && (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-black text-zinc-400">Select Wise Touch System</label>
                      <select value={selectedSystemForImage.name} onChange={(e) => { const next = DEFAULT_SYSTEMS.find((s) => s.name === e.target.value); if (next) setSelectedSystemForImage(next); }} className="h-12 w-full rounded-2xl border border-zinc-800 bg-black/50 px-4 text-white">
                        {DEFAULT_SYSTEMS.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
                      </select>
                    </div>
                    <button type="button" onClick={transformImage} disabled={isTransforming} className={`w-full rounded-2xl py-3 font-black flex items-center justify-center gap-2 ${isTransforming ? "bg-zinc-800 text-zinc-500" : "bg-yellow-500 text-black"}`}>
                      {isTransforming ? <><Loader size={20} className="animate-spin" />Transforming...</> : "Transform Image"}
                    </button>
                    {transformError && <div className="rounded-2xl bg-red-500/20 p-3 text-sm text-red-300">{transformError}</div>}
                  </div>
                )}
              </div>
              <div className="rounded-3xl border border-zinc-800 bg-black/40 p-6">
                <h3 className="mb-4 text-xl font-black text-yellow-300">Result</h3>
                {transformedImage ? (
                  <div className="space-y-4">
                    <img src={transformedImage} alt="Transformed" className="w-full rounded-2xl" />
                    <button type="button" onClick={async () => {
                      try {
                        const response = await fetch("/api/download-image", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ imageData: uploadedImage, prompt: buildPrompt(selectedSystemForImage) }),
                        });
                        if (!response.ok) throw new Error("Download failed");
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "wisetouch-transformed.svg";
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                      } catch (err) {
                        alert("Download failed: " + err.message);
                      }
                    }} className="w-full rounded-2xl bg-yellow-500 px-4 py-3 font-black text-black">Download Image</button>
                  </div>
                ) : (
                  <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-zinc-700 text-center text-zinc-500">
                    {isTransforming ? (
                      <div className="space-y-3">
                        <Loader size={32} className="mx-auto animate-spin text-yellow-300" />
                        <div className="font-black">Transforming your image...</div>
                      </div>
                    ) : (
                      <div>Transform an image to see the result</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
