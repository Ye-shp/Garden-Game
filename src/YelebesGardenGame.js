// YelebesGardenGame.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Heart, Droplet, Sun, Sparkles, Moon, Clock, Award, Flower2, Trash2, Menu, X, Shuffle 
} from 'lucide-react';
import classNames from 'classnames';

// Constants
const TILE_SIZE = 40; // Size of each garden tile
const GRID_WIDTH = 20;
const GRID_HEIGHT = 15;

// Special Combinations with Romantic Messages
const SPECIAL_COMBINATIONS = {
    ROSE_MOONFLOWER: {
      plants: ['ROSE', 'MOONFLOWER'],
      message: "Your smile lights up even the darkest night ✨",
      achievement: "Moonlit Wonder"
    },
    CRYSTAL_STARBLOOM: {
      plants: ['CRYSTAL_LOTUS', 'STARBLOOM'],
      message: "You make ordinary moments feel magical 💫",
      achievement: "Stellar Spirit"
    },
    RAINBOW_PHOENIX: {
      plants: ['RAINBOW_IRIS', 'PHOENIX_BLOOM'],
      message: " Didn't know gossiping was fun before you🌈",
      achievement: "Gossip girl"
    },
    DRAGON_CRYSTAL: {
      plants: ['DRAGON_SNAP', 'CRYSTAL_LOTUS'],
      message: " Smartest Person I know✨",
      achievement: "Humble Genius"
    },
    LAVENDER_SAGE: {
      plants: ['LAVENDER', 'SAGE'],
      message: "You're funny once in a while 💜",
      achievement: "Queen of smiles"
    },
    SUNFLOWER_PHOENIX: {
      plants: ['SUNFLOWER', 'PHOENIX_BLOOM'],
      message: "You inspire others to shine their brightest 🌻",
      achievement: "Radiant Soul"
    },
    MOONFLOWER_SHADOW: {
      plants: ['MOONFLOWER', 'SHADOW_VINE'],
      message: "Miss never miss with a camera🌙",
      achievement: "Photogenic"
    },
    RAINBOW_CRYSTAL: {
      plants: ['RAINBOW_IRIS', 'CRYSTAL_LOTUS'],
      message: "You'e a fruit cup!🌈",
      achievement: "Out the closet"
    },
    DRAGON_PHOENIX: {
      plants: ['DRAGON_SNAP', 'PHOENIX_BLOOM'],
      message: "Keep a resting bitch face 🐲",
      achievement: "Scare them away!"
    },
    STARBLOOM_MOONFLOWER: {
      plants: ['STARBLOOM', 'MOONFLOWER'],
      message: "You have a glow that puts the stars to shame ⭐",
      achievement: "Star girl"
    },
    ROSE_LAVENDER: {
      plants: ['ROSE', 'LAVENDER'],
      message: "🌹",
      achievement: "Mwaaah"
    },
    SAGE_CRYSTAL: {
      plants: ['SAGE', 'CRYSTAL_LOTUS'],
      message: "Your wisdom and kindness are truly remarkable 🌿",
      achievement: "Kind Spirit"
    },
    SUNFLOWER_RAINBOW: {
      plants: ['SUNFLOWER', 'RAINBOW_IRIS'],
      message: "Your sweet gaze melts my heart🌻",
      achievement: "Loving gaze"
    },
    DRAGON_MOONFLOWER: {
      plants: ['DRAGON_SNAP', 'MOONFLOWER'],
      message: "  Your ability to not waste a nut🐲",
      achievement: "Master Nut "
    },
    CRYSTAL_SHADOW: {
      plants: ['CRYSTAL_LOTUS', 'SHADOW_VINE'],
      message: " Butt sex is not that scary✨",
      achievement: "Anal queen"
    }
  };

// Plant Definitions with Cross-Pollination Traits
const PLANTS = {
  ROSE: {
    name: 'Rose',
    emoji: '🌹',
    growthStage: ['🌱', '🌿', '🥀', '🌹'],
    needs: { water: 7, sunlight: 8, pollination: 6 },
    effects: { harmony: 3, attraction: 4, love: 5 },
    companionBonus: ['MOONFLOWER', 'CRYSTAL_LOTUS'],
    pollinationChance: 0.4,
    offspring: ['RAINBOW_IRIS', 'ROSE'],
    repels: ['THISTLE'],
    rarity: 'common',
    description: 'A classic symbol of our love'
  },
  CRYSTAL_LOTUS: {
    name: 'Crystal Lotus',
    emoji: '❇️',
    growthStage: ['🌱', '✨', '❇️', '💠'],
    needs: { water: 9, sunlight: 10, moonlight: 8 },
    effects: { magic: 5, purification: 4, wisdom: 3 },
    companionBonus: ['MOONFLOWER', 'STARBLOOM'],
    pollinationChance: 0.3,
    offspring: ['STARBLOOM', 'CRYSTAL_LOTUS'],
    repels: ['SHADOW_VINE'],
    rarity: 'legendary',
    description: 'Rare flower that blooms under moonlight'
  },
  MOONFLOWER: {
    name: 'Moonflower',
    emoji: '🌙',
    growthStage: ['🌱', '🌿', '🌑', '🌙'],
    needs: { moonlight: 9, water: 6, magic: 7 },
    effects: { nightBloom: 4, mystery: 3, dreams: 5 },
    companionBonus: ['STARBLOOM', 'SHADOW_VINE'],
    pollinationChance: 0.45,
    offspring: ['ROSE', 'MOONFLOWER'],
    rarity: 'rare',
    description: 'Blooms under moonlight'
  },
  STARBLOOM: {
    name: 'Starbloom',
    emoji: '⭐',
    growthStage: ['🌱', '✨', '⚡', '⭐'],
    needs: { moonlight: 10, harmony: 7, magic: 6 },
    effects: { light: 5, dreams: 4, protection: 3 },
    companionBonus: ['CRYSTAL_LOTUS', 'MOONFLOWER'],
    pollinationChance: 0.35,
    offspring: ['PHOENIX_BLOOM', 'STARBLOOM'],
    rarity: 'epic',
    description: 'Glows with celestial energy'
  },
  PHOENIX_BLOOM: {
    name: 'Phoenix Bloom',
    emoji: '🔥',
    growthStage: ['🌱', '🔥', '✨', '🌺'],
    needs: { sunlight: 10, heat: 8, magic: 7 },
    effects: { rebirth: 5, warmth: 4, protection: 3 },
    companionBonus: ['DRAGON_SNAP', 'SUNFLOWER'],
    pollinationChance: 0.3,
    offspring: ['PHOENIX_BLOOM', 'DRAGON_SNAP'],
    rarity: 'legendary',
    description: 'Reborn from its own ashes'
  },
  DRAGON_SNAP: {
    name: 'Dragon Snap',
    emoji: '🐲',
    growthStage: ['🌱', '🦎', '🐉', '🐲'],
    needs: { heat: 9, magic: 8, moonlight: 6 },
    effects: { strength: 4, protection: 5, courage: 3 },
    companionBonus: ['PHOENIX_BLOOM', 'CRYSTAL_LOTUS'],
    pollinationChance: 0.25,
    offspring: ['DRAGON_SNAP', 'CRYSTAL_LOTUS'],
    rarity: 'epic',
    description: 'Breathes tiny flames'
  },
  RAINBOW_IRIS: {
    name: 'Rainbow Iris',
    emoji: '🌈',
    growthStage: ['🌱', '🌿', '🎨', '🌈'],
    needs: { water: 7, sunlight: 8, harmony: 6 },
    effects: { joy: 5, creativity: 4, healing: 3 },
    companionBonus: ['CRYSTAL_LOTUS', 'STARBLOOM'],
    pollinationChance: 0.35,
    offspring: ['RAINBOW_IRIS', 'ROSE'],
    rarity: 'rare',
    description: 'Changes colors with mood'
  },
  LAVENDER: {
    name: 'Lavender',
    emoji: '💜',
    growthStage: ['🌱', '🌿', '🌸', '💜'],
    needs: { water: 4, sunlight: 9, pollination: 5 },
    effects: { harmony: 2, repelPests: 3, calm: 4 },
    companionBonus: ['ROSE', 'SAGE'],
    pollinationChance: 0.2,
    offspring: ['LAVENDER', 'ROSE'],
    repels: ['WEED'],
    rarity: 'common',
    description: 'Brings peace and tranquility'
  },
  SUNFLOWER: {
    name: 'Sunflower',
    emoji: '🌻',
    growthStage: ['🌱', '🌿', '🌼', '🌻'],
    needs: { water: 6, sunlight: 10, pollination: 7 },
    effects: { joy: 4, energy: 5, attractPollinators: 4 },
    companionBonus: ['PHOENIX_BLOOM', 'SAGE'],
    pollinationChance: 0.5,
    offspring: ['SUNFLOWER', 'RAINBOW_IRIS'],
    repels: ['SHADOW_VINE'],
    rarity: 'common',
    description: 'Always follows the sun'
  },
  SAGE: {
    name: 'Sage',
    emoji: '🌿',
    growthStage: ['🌱', '🌿', '🍃', '🌿'],
    needs: { water: 5, sunlight: 7, pollination: 4 },
    effects: { purification: 3, repelPests: 4, wisdom: 2 },
    companionBonus: ['LAVENDER', 'SUNFLOWER'],
    pollinationChance: 0.15,
    offspring: ['SAGE', 'LAVENDER'],
    repels: ['WEED'],
    rarity: 'common',
    description: 'Enhances the garden’s harmony'
  },
  SHADOW_VINE: {
    name: 'Shadow Vine',
    emoji: '🕸️',
    growthStage: ['🌱', '🕸️', '🌑', '🕸️'],
    needs: { moonlight: 7, magic: 5, water: 3 },
    effects: { mystery: 4, dreams: 3, repelLight: 2 },
    companionBonus: ['MOONFLOWER', 'CRYSTAL_LOTUS'],
    pollinationChance: 0.1,
    offspring: ['SHADOW_VINE'],
    rarity: 'rare',
    description: 'Creeps silently through the night'
  },
  THISTLE: {
    name: 'Thistle',
    emoji: '🌾',
    growthStage: ['🌱', '🌾', '🥀', '🌾'],
    needs: { water: 3, sunlight: 6, pollination: 2 },
    effects: { repelPests: 5, protection: 3, resilience: 2 },
    companionBonus: ['ROSE'],
    pollinationChance: 0.05,
    offspring: ['THISTLE'],
    rarity: 'common',
    description: 'Protects the garden from unwanted visitors'
  },
  // Additional plants can be added here with similar structure
};

// Weather Definitions
const WEATHER_TYPES = {
  SUNNY: { 
    icon: '☀️', 
    waterLoss: 2, 
    growth: 1.5,
    effects: ['sunlight', 'heat']
  },
  RAINY: { 
    icon: '🌧️', 
    waterGain: 3, 
    growth: 1.2,
    effects: ['water', 'harmony']
  },
  STORM: {
    icon: '⛈️',
    waterGain: 4,
    growth: 0.8,
    effects: ['magic', 'energy']
  },
  MAGICAL_MIST: {
    icon: '✨',
    waterGain: 1,
    growth: 1.3,
    effects: ['magic', 'mystery', 'dreams']
  },
  MOONLIT: {
    icon: '🌙',
    waterLoss: 1,
    growth: 1.1,
    effects: ['moonlight', 'dreams', 'mystery']
  }
};

// Special Tools
const TOOLS = {
  PLANT: 'PLANT',
  WATER: 'WATER',
  REMOVE: 'REMOVE',
  CROSS_POLLINATE: 'CROSS_POLLINATE'
};

// Helper Functions

// Get adjacent cells for a given position
const getAdjacentCells = (garden, x, y) => {
  const directions = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0],         [1, 0],
    [-1, 1],  [0, 1], [1, 1],
  ];
  const adjacent = [];
  directions.forEach(([dx, dy]) => {
    const nx = x + dx;
    const ny = y + dy;
    if (nx >= 0 && nx < GRID_WIDTH && ny >= 0 && ny < GRID_HEIGHT) {
      adjacent.push(garden[ny][nx]);
    }
  });
  return adjacent;
};

// Calculate environmental score based on needs and weather
const calculateEnvironmentalScore = (cell, adjacentCells, weather) => {
  const plantInfo = PLANTS[cell.type];
  let score = 0;

  // Water
  if (plantInfo.needs.water) {
    score += (cell.water || 0) >= plantInfo.needs.water ? 2 : -1;
  }

  // Sunlight
  if (plantInfo.needs.sunlight) {
    score += weather.effects.includes('sunlight') ? 2 : -1;
  }

  // Moonlight
  if (plantInfo.needs.moonlight) {
    score += weather.effects.includes('moonlight') ? 2 : -1;
  }

  // Heat
  if (plantInfo.needs.heat) {
    score += weather.effects.includes('heat') ? 2 : -1;
  }

  // Harmony
  if (plantInfo.needs.harmony) {
    score += weather.effects.includes('harmony') ? 1 : -0.5;
  }

  // Pollination
  if (plantInfo.needs.pollination) {
    const pollinatorEffect = cell.pollinators ? 1 : -1;
    score += pollinatorEffect;
  }

  // Magic
  if (plantInfo.needs.magic) {
    score += weather.effects.includes('magic') ? 1.5 : -0.5;
  }

  // Additional factors can be added here

  return score;
};

// Calculate Magical Influence
const calculateMagicalInfluence = (newGarden, x, y, magicLevel, checkGeometric = false, setNotification) => {
  const cell = newGarden[y][x];
  const plantInfo = PLANTS[cell.type];
  let influence = 0;

  // Magical resonance based on plant rarity
  switch (plantInfo.rarity) {
    case 'legendary': influence += 3; break;
    case 'epic': influence += 2; break;
    case 'rare': influence += 1; break;
    default: influence += 0.5;
  }

  // Special magical interactions
  if (plantInfo.needs.magic) {
    influence += (magicLevel / 100) * 2;
  }

  // Geometric patterns boost magic
  if (checkGeometric && checkGeometricPattern(newGarden, x, y, cell.type)) {
    influence *= 1.5;
    setNotification(`✨ Magical resonance detected at square (${x}, ${y})!`, 'magic');
  }

  return influence;
};

// Calculate Moonlight Effect
const calculateMoonlightEffect = (cell, moonPhase) => {
  const plantInfo = PLANTS[cell.type];
  if (!plantInfo.needs.moonlight) return 0;

  // Moon phase affects plants that need moonlight
  const moonStrength = Math.sin((moonPhase / 30) * Math.PI) + 1; // 0 to 2
  return moonStrength * (plantInfo.needs.moonlight / 10);
};

// Check for Geometric Patterns
const checkGeometricPattern = (garden, x, y, type) => {
  // Check for square or triangle patterns of the same plant type
  const directions = [
    [1, 0], [0, 1], [1, 1], [1, -1]
  ];
  let count = 0;

  directions.forEach(([dx, dy]) => {
    const nx = x + dx;
    const ny = y + dy;
    if (nx >= 0 && nx < GRID_WIDTH && ny >= 0 && ny < GRID_HEIGHT) {
      if (garden[ny][nx]?.type === type) {
        count += 1;
      }
    }
  });

  return count >= 3;
};

// Add CSS animations for the garden
const styles = `
  .garden-tile {
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .garden-tile:hover {
    transform: scale(1.1);
    z-index: 1;
  }

  .garden-tile::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle, transparent 60%, rgba(255,255,255,0.2) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .garden-tile:hover::before {
    opacity: 1;
  }

  .pollen-particle {
    position: absolute;
    width: 8px;
    height: 8px;
    background: radial-gradient(circle, #fff9c4 0%, transparent 100%);
    border-radius: 50%;
    pointer-events: none;
    animation: float 2s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(10px, -10px) rotate(90deg); }
    50% { transform: translate(20px, 0) rotate(180deg); }
    75% { transform: translate(10px, 10px) rotate(270deg); }
  }

  .notification-enter {
    transform: translateX(100%);
    opacity: 0;
  }

  .notification-enter-active {
    transform: translateX(0);
    opacity: 1;
    transition: all 0.3s ease;
  }

  .notification-exit {
    transform: translateX(0);
    opacity: 1;
  }

  .notification-exit-active {
    transform: translateX(100%);
    opacity: 0;
    transition: all 0.3s ease;
  }
`;

// Inject styles into the document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// YelebesGardenGame Component
const YelebesGardenGame = () => {
  // State Variables
  const [garden, setGarden] = useState(Array(GRID_HEIGHT).fill().map(() => 
    Array(GRID_WIDTH).fill(null)
  ));
  const [weather, setWeather] = useState('SUNNY');
  const [ecosystemHealth, setEcosystemHealth] = useState(100);
  const [magicLevel, setMagicLevel] = useState(0);
  const [pollinators, setPollinators] = useState(0);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [selectedTool, setSelectedTool] = useState(TOOLS.PLANT); // Default tool
  const [gameTime, setGameTime] = useState(0);
  const [notification, setNotification] = useState(null); // Single notification
  const [achievements, setAchievements] = useState([]);
  const [moonPhase, setMoonPhase] = useState(0);
  const [rarePlantDiscoveries, setRarePlantDiscoveries] = useState(new Set());
  
  // New State Variables for Special Combinations and Resources
  const [lastWeatherChange, setLastWeatherChange] = useState(Date.now());
  const [discoveredCombinations, setDiscoveredCombinations] = useState(new Set());
  const [specialAchievements, setSpecialAchievements] = useState([]);
  const [resources, setResources] = useState({
    water: 100,
    magic: 50,
    seeds: {
      common: 10,
      rare: 3,
      epic: 1,
      legendary: 0
    }
  });
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState(0);

  // New State for Mobile Side Panel
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  // State for Cross-Pollination Selection
  const [crossPollinationSelection, setCrossPollinationSelection] = useState({
    first: null, // {x, y}
    second: null
  });

  // Simulation Tick
  useEffect(() => {
    const tick = setInterval(() => {
      if (!paused) {
        setGameTime(prev => prev + 1);
        simulateEcosystem();
        updateWeather();
        updateMoonPhase();
        checkAchievements();
        updateResources();
      }
    }, 1000);

    return () => clearInterval(tick);
  }, [paused, garden, weather, moonPhase, magicLevel, lastWeatherChange, discoveredCombinations, resources]);

  // Simulate Ecosystem
  const simulateEcosystem = useCallback(() => {
    setGarden(prevGarden => {
      // Create a deep copy of the previous garden
      const newGarden = prevGarden.map(row => row.map(cell => (cell ? { ...cell } : null)));

      // Iterate through each cell to update plant stats
      for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
          const cell = newGarden[y][x];
          if (!cell) continue;

          const adjacentCells = getAdjacentCells(prevGarden, x, y);
          const currentWeather = WEATHER_TYPES[weather];

          const environmentalScore = calculateEnvironmentalScore(cell, adjacentCells, currentWeather);
          const magicalInfluence = calculateMagicalInfluence(newGarden, x, y, magicLevel, false, setNotification);
          const moonlightEffect = calculateMoonlightEffect(cell, moonPhase);

          // Update plant stats
          cell.health = Math.min(100, cell.health + environmentalScore + magicalInfluence + moonlightEffect);
          cell.growth += (environmentalScore + magicalInfluence + moonlightEffect) > 0 ? 0.15 : -0.08;
          cell.magic = Math.min(100, (cell.magic || 0) + (magicalInfluence * 0.5));
          cell.water = Math.max(0, (cell.water || 10) + (currentWeather.waterGain || -currentWeather.waterLoss || 0));

          // Check for evolution or spread
          if (cell.growth >= 4) {
            evolveOrSpread(cell, x, y, newGarden);
          } else if (cell.health <= 0) {
            const plantInfo = PLANTS[cell.type];
            if (plantInfo.rarity === 'legendary') {
              addNotification(`💔 A legendary ${plantInfo.name} has withered away...`, 'error');
            } else {
              addNotification(`A ${plantInfo.name} has withered...`, 'warning');
            }
            newGarden[y][x] = null; // Remove the plant from the garden
          }
        }
      }

      return newGarden;
    });

    updateEcosystemHealth();
    updateMagicLevel();
  }, [garden, weather, moonPhase, magicLevel, lastWeatherChange, discoveredCombinations, resources]);

  // Calculate Magical Influence
  const calculateMagicalInfluence = (newGarden, x, y, magicLevel, checkGeometric, setNotification) => {
    const cell = newGarden[y][x];
    const plantInfo = PLANTS[cell.type];
    let influence = 0;

    // Magical resonance based on plant rarity
    switch (plantInfo.rarity) {
      case 'legendary': influence += 3; break;
      case 'epic': influence += 2; break;
      case 'rare': influence += 1; break;
      default: influence += 0.5;
    }

    // Special magical interactions
    if (plantInfo.needs.magic) {
      influence += (magicLevel / 100) * 2;
    }

    // Geometric patterns boost magic
    if (checkGeometric && checkGeometricPattern(newGarden, x, y, cell.type)) {
      influence *= 1.5;
      setNotification(`✨ Magical resonance detected at square (${x}, ${y})!`, 'magic');
    }

    return influence;
  };

  // Calculate Moonlight Effect
  const calculateMoonlightEffect = (cell, moonPhase) => {
    const plantInfo = PLANTS[cell.type];
    if (!plantInfo.needs.moonlight) return 0;

    // Moon phase affects plants that need moonlight
    const moonStrength = Math.sin((moonPhase / 30) * Math.PI) + 1; // 0 to 2
    return moonStrength * (plantInfo.needs.moonlight / 10);
  };

  // Check for Geometric Patterns
  const checkGeometricPattern = (garden, x, y, type) => {
    // Check for square or triangle patterns of the same plant type
    const directions = [
      [1, 0], [0, 1], [1, 1], [1, -1]
    ];
    let count = 0;

    directions.forEach(([dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < GRID_WIDTH && ny >= 0 && ny < GRID_HEIGHT) {
        if (garden[ny][nx]?.type === type) {
          count += 1;
        }
      }
    });

    return count >= 3;
  };

  // Add Notification (Limited to One at a Time)
  const addNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, type === 'special' ? 5000 : 3000);
  };

  // Evolve or Spread Plant
  const evolveOrSpread = (cell, x, y, newGarden) => {
    const plantInfo = PLANTS[cell.type];
    
    // Reset spreading timer to prevent rapid expansion
    if (cell.lastSpread && Date.now() - cell.lastSpread < 10000) return;
    
    // Handle magical evolution
    if (cell.magic >= 90 && Math.random() < 0.1) {
      addNotification(`🌟 Magical evolution occurred for ${plantInfo.name}!`, 'magic');
      cell.growth = 4;
      cell.evolved = true;
      cell.magical = true;
      cell.effects = {
        ...plantInfo.effects,
        magic: (plantInfo.effects.magic || 0) + 2
      };
    }

    // Handle spreading with cross-pollination is now manual, so remove automatic spread
    // Previously handled spreading here
  };

  // Get Empty Adjacent Tiles
  const getEmptyAdjacentTiles = (garden, x, y) => {
    const directions = [
      [-1, -1], [0, -1], [1, -1],
      [-1, 0],         [1, 0],
      [-1, 1],  [0, 1], [1, 1],
    ];
    const empty = [];
    directions.forEach(([dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < GRID_WIDTH && ny >= 0 && ny < GRID_HEIGHT) {
        if (garden[ny][nx] === null) {
          empty.push([nx, ny]);
        }
      }
    });
    return empty;
  };

  // Create New Plant
  const createNewPlant = (type) => {
    const plantInfo = PLANTS[type];
    const newPlant = {
      type,
      health: 100,
      growth: 1,
      evolved: false,
      magic: plantInfo.rarity === 'legendary' ? 50 : 
             plantInfo.rarity === 'epic' ? 30 :
             plantInfo.rarity === 'rare' ? 20 : 10,
      water: 10,
      pollinators: 0,
      lastSpread: null, // To manage spreading cooldown
      hasCrossPollinated: false, // Initialize cross-pollination flag
    };

    // Track rare plant discoveries
    if (plantInfo.rarity !== 'common' && !rarePlantDiscoveries.has(type)) {
      setRarePlantDiscoveries(prev => new Set([...prev, type]));
      addNotification(`🏆 New discovery: ${plantInfo.name}!`, 'success');
      setScore(prev => prev + getPlantScore(plantInfo.rarity));
    }

    return newPlant;
  };

  // Handle Tile Click (Includes Tool Selection and Combination Checking)
  const handleTileClick = (x, y) => {
    if (paused) return;

    switch (selectedTool) {
      case TOOLS.PLANT:
        if (selectedPlant && !garden[y][x]) {
          const plantInfo = PLANTS[selectedPlant];
          const seedType = plantInfo.rarity.toLowerCase();
          
          if (resources.seeds[seedType] > 0) {
            setGarden(prev => {
              const newGarden = prev.map(row => [...row]);
              newGarden[y][x] = createNewPlant(selectedPlant);
              return newGarden;
            });
            
            setResources(prev => ({
              ...prev,
              seeds: {
                ...prev.seeds,
                [seedType]: prev.seeds[seedType] - 1
              }
            }));
            
            setScore(prev => prev + getPlantScore(plantInfo.rarity));
            addNotification(`🌱 Planted ${plantInfo.name}!`, 'success');

            // Check for special combinations after planting
            checkSpecialCombinations(x, y, selectedPlant, garden);
          } else {
            addNotification(`❌ Not enough ${seedType} seeds!`, 'error');
          }
        }
        break;

      case TOOLS.WATER:
        if (garden[y][x] && resources.water >= 10) {
          setGarden(prev => {
            const newGarden = prev.map(row => [...row]);
            const cell = newGarden[y][x];
            cell.water = Math.min(100, cell.water + 20);
            return newGarden;
          });
          setResources(prev => ({
            ...prev,
            water: prev.water - 10
          }));
          addNotification('💧 Watered plant!', 'info');
        }
        break;

      case TOOLS.REMOVE:
        if (garden[y][x]) {
          const plantInfo = PLANTS[garden[y][x].type];
          setGarden(prev => {
            const newGarden = prev.map(row => [...row]);
            newGarden[y][x] = null;
            return newGarden;
          });
          // Give back some seeds when removing plants
          setResources(prev => ({
            ...prev,
            seeds: {
              ...prev.seeds,
              [plantInfo.rarity.toLowerCase()]: prev.seeds[plantInfo.rarity.toLowerCase()] + 1
            }
          }));
          addNotification(`🗑️ Removed ${plantInfo.name}`, 'warning');
        }
        break;

      case TOOLS.CROSS_POLLINATE:
        handleCrossPollinationClick(x, y);
        break;

      default:
        break;
    }
  };

  // Handle Cross-Pollination Clicks
  const handleCrossPollinationClick = (x, y) => {
    const selectedCell = garden[y][x];
    if (!selectedCell) {
      addNotification('❌ Please select a plant to cross-pollinate.', 'error');
      return;
    }

    // If first selection is null, set it
    if (!crossPollinationSelection.first) {
      setCrossPollinationSelection({ first: { x, y }, second: null });
      addNotification(`🔍 Selected first plant at (${x}, ${y}). Select another adjacent plant.`, 'info');
      return;
    }

    // If second selection is already set, reset selections
    if (crossPollinationSelection.second) {
      setCrossPollinationSelection({ first: null, second: null });
    }

    // Check if the second plant is adjacent to the first
    const first = crossPollinationSelection.first;
    const isAdjacent = Math.abs(first.x - x) <= 1 && Math.abs(first.y - y) <= 1 && !(first.x === x && first.y === y);

    if (!isAdjacent) {
      addNotification('❌ Plants must be adjacent to cross-pollinate.', 'error');
      setCrossPollinationSelection({ first: null, second: null });
      return;
    }

    const second = { x, y };
    setCrossPollinationSelection({ first, second });

    // Perform cross-pollination
    performCrossPollination(first, second);
  };

  // Perform Cross-Pollination
  const performCrossPollination = (first, second) => {
    const firstPlant = garden[first.y][first.x];
    const secondPlant = garden[second.y][second.x];

    if (!firstPlant || !secondPlant) {
      addNotification('❌ One of the selected plants does not exist.', 'error');
      return;
    }

    // Optional: Check for resources, e.g., magic
    if (resources.magic < 10) {
      addNotification('❌ Not enough magic to perform cross-pollination!', 'error');
      return;
    }

    // Determine offspring based on both plants' offspring lists
    const possibleOffspring = [...new Set([...PLANTS[firstPlant.type].offspring, ...PLANTS[secondPlant.type].offspring])];
    if (possibleOffspring.length === 0) {
      addNotification('❌ These plants cannot cross-pollinate.', 'error');
      return;
    }

    const offspringType = possibleOffspring[Math.floor(Math.random() * possibleOffspring.length)];

    // Find an empty adjacent tile around the first plant
    const emptyAdjacentFirst = getEmptyAdjacentTiles(garden, first.x, first.y);
    // Find an empty adjacent tile around the second plant
    const emptyAdjacentSecond = getEmptyAdjacentTiles(garden, second.x, second.y);
    // Combine and remove duplicates
    const emptyTiles = [...emptyAdjacentFirst, ...emptyAdjacentSecond].filter((tile, index, self) => 
      index === self.findIndex(t => t[0] === tile[0] && t[1] === tile[1]))
    ;

    if (emptyTiles.length === 0) {
      addNotification('❌ No empty space available for offspring.', 'error');
      return;
    }

    // Choose a random empty tile for the offspring
    const [offspringX, offspringY] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

    // Create the offspring plant
    setGarden(prev => {
      const newGarden = prev.map(row => [...row]);
      newGarden[offspringY][offspringX] = createNewPlant(offspringType);
      return newGarden;
    });

    // Deduct magic resource
    setResources(prev => ({
      ...prev,
      magic: prev.magic - 10
    }));

    addNotification(`💕 Cross-pollinated ${PLANTS[firstPlant.type].name} and ${PLANTS[secondPlant.type].name} to create ${PLANTS[offspringType].name}!`, 'special');

    // Reset cross-pollination selection
    setCrossPollinationSelection({ first: null, second: null });
  };

  // Helper function to get plant score
  const getPlantScore = (rarity) => {
    switch (rarity) {
      case 'legendary': return 100;
      case 'epic': return 50;
      case 'rare': return 25;
      default: return 10;
    }
  };

  // Update Weather (Changes every 3 minutes)
  const updateWeather = useCallback(() => {
    const currentTime = Date.now();
    if (currentTime - lastWeatherChange >= 180000) { // 3 minutes in ms
      const weatherCycle = ['SUNNY', 'RAINY', 'STORM', 'MAGICAL_MIST', 'MOONLIT'];
      const newWeather = weatherCycle[Math.floor(Math.random() * weatherCycle.length)];
      setWeather(newWeather);
      setLastWeatherChange(currentTime);
      addNotification(`🌤️ Weather changed to ${newWeather}`, 'info');
    }
  }, [lastWeatherChange]);

  // Update Moon Phase
  const updateMoonPhase = useCallback(() => {
    setMoonPhase(prev => (prev + 1) % 30);
  }, []);

  // Check Achievements
  const checkAchievements = useCallback(() => {
    // Example achievements
    const newAchievements = [];
    if (gameTime === 60) newAchievements.push('One Minute Gardener');
    if (gameTime === 300) newAchievements.push('Five Minute Gardener');
    if (rarePlantDiscoveries.size >= 5) newAchievements.push('Botanist Supreme');
    if (score >= 500) newAchievements.push('Master Gardener');
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
      newAchievements.forEach(ach => addNotification(`🏅 Achievement Unlocked: ${ach}`, 'success'));
    }
  }, [gameTime, rarePlantDiscoveries, score]);

  // Check for Special Combinations
  const checkSpecialCombinations = useCallback((x, y, plantType, updatedGarden) => {
    const adjacentCells = getAdjacentCells(updatedGarden, x, y);
    const adjacentTypes = new Set(adjacentCells.map(cell => cell?.type).filter(Boolean));
    adjacentTypes.add(plantType);

    Object.entries(SPECIAL_COMBINATIONS).forEach(([key, combo]) => {
      if (!discoveredCombinations.has(key) && 
          combo.plants.every(plant => adjacentTypes.has(plant))) {
        // New combination discovered!
        setDiscoveredCombinations(prev => new Set([...prev, key]));
        setSpecialAchievements(prev => [...prev, {
          name: combo.achievement,
          message: combo.message,
          timestamp: Date.now()
        }]);
        
        addNotification(`💝 ${combo.achievement} Discovered!`, 'magic');
        setTimeout(() => {
          addNotification(combo.message, 'special');
        }, 1500);
      }
    });
  }, [discoveredCombinations]);

  // Update Ecosystem Health
  const updateEcosystemHealth = useCallback(() => {
    // Calculate ecosystem health based on plant health
    let totalHealth = 0;
    let plantCount = 0;
    garden.forEach(row => {
      row.forEach(cell => {
        if (cell) {
          totalHealth += cell.health;
          plantCount += 1;
        }
      });
    });
    const averageHealth = plantCount > 0 ? totalHealth / plantCount : 100;
    setEcosystemHealth(Math.min(100, averageHealth));
  }, [garden]);

  // Update Magic Level
  const updateMagicLevel = useCallback(() => {
    // Calculate magic level based on plants
    let totalMagic = 0;
    garden.forEach(row => {
      row.forEach(cell => {
        if (cell && cell.magic) {
          totalMagic += cell.magic;
        }
      });
    });
    const newMagicLevel = Math.min(100, totalMagic / (GRID_WIDTH * GRID_HEIGHT));
    setMagicLevel(newMagicLevel);
  }, [garden]);

  // Update Resources
  const updateResources = useCallback(() => {
    setResources(prev => ({
      ...prev,
      water: Math.min(100, prev.water + (weather === 'RAINY' ? 2 : 0.5)),
      magic: Math.min(100, prev.magic + (weather === 'MAGICAL_MIST' ? 2 : 0.2)),
      seeds: {
        ...prev.seeds,
        common: Math.min(20, prev.seeds.common + (Math.random() < 0.1 ? 1 : 0)),
        rare: Math.min(10, prev.seeds.rare + (Math.random() < 0.05 ? 1 : 0)),
        epic: Math.min(5, prev.seeds.epic + (Math.random() < 0.02 ? 1 : 0)),
        legendary: Math.min(2, prev.seeds.legendary + (Math.random() < 0.005 ? 1 : 0))
      }
    }));
  }, [weather]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50">
      {/* Header with magical essence */}
      <div className="p-4 bg-white/80 backdrop-blur-sm shadow-lg border-b border-purple-100 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Yelebe's Enchanted Garden
          </h1>
          <Award className="text-yellow-500 hidden sm:inline" />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-6 items-center hidden sm:flex">
            {/* Weather Display */}
            <div className="flex items-center">
              <Sun className="mr-2" />
              <span>{WEATHER_TYPES[weather].icon} {weather}</span>
            </div>
            {/* Ecosystem Health */}
            <div className="flex items-center">
              <Heart className="mr-2 text-red-500" />
              <span>Health: {ecosystemHealth.toFixed(1)}</span>
            </div>
            {/* Magic Level */}
            <div className="flex items-center">
              <Sparkles className="mr-2 text-purple-500" />
              <span>Magic: {magicLevel.toFixed(1)}</span>
            </div>
            {/* Pollinators */}
            <div className="flex items-center">
              <Droplet className="mr-2 text-blue-500" />
              <span>Pollinators: {pollinators}</span>
            </div>
            {/* Moon Phase */}
            <div className="flex items-center">
              <Moon className="mr-2 text-gray-700" />
              <span>Moon Phase: {moonPhase}/30</span>
            </div>
            {/* Score Display */}
            <div className="flex items-center">
              <Award className="mr-2 text-yellow-500" />
              <span>Score: {score}</span>
            </div>
          </div>
          {/* Mobile Menu Button */}
          <button
            className="sm:hidden p-2 rounded bg-gray-200 focus:outline-none"
            onClick={() => setIsSidePanelOpen(true)}
            aria-label="Open menu"
          >
            <Menu />
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-1 p-4 overflow-hidden">
        {/* Garden Grid Container */}
        <div className="flex justify-center w-full">
          {/* Garden Grid */}
          <div id="garden-grid" className="grid relative mx-auto px-4 sm:px-0" style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_WIDTH}, ${TILE_SIZE}px)`,
            gridTemplateRows: `repeat(${GRID_HEIGHT}, ${TILE_SIZE}px)`,
            gap: '2px',
            flexGrow: 1,
            backgroundColor: '#e0ffe0',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            // Removed the non-reactive transform based on window.innerWidth
          }}>
            {garden.map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  className={classNames(
                    "garden-tile border flex items-center justify-center cursor-pointer transition-all duration-300",
                    {
                      'bg-green-100 hover:bg-green-200': selectedTool === TOOLS.PLANT && !cell,
                      'bg-blue-100 hover:bg-blue-200': selectedTool === TOOLS.WATER && cell,
                      'bg-red-100 hover:bg-red-200': selectedTool === TOOLS.REMOVE && cell,
                      'bg-purple-100 hover:bg-purple-200': selectedTool === TOOLS.CROSS_POLLINATE && cell,
                      'bg-gray-100 cursor-not-allowed': paused
                    }
                  )}
                  onClick={() => handleTileClick(x, y)}
                  style={{ width: TILE_SIZE, height: TILE_SIZE }}
                  title={cell ? PLANTS[cell.type].description : 'Empty'}
                >
                  {cell ? PLANTS[cell.type].emoji : ''}
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Side Panel */}
        <div className={classNames(
          "w-64 flex flex-col overflow-y-auto bg-white rounded-lg shadow-lg p-4 fixed top-0 right-0 h-full z-50 transition-transform duration-300 sm:static sm:h-auto sm:w-64 sm:flex sm:translate-x-0",
          {
            "translate-x-full": !isSidePanelOpen, // Hidden by translating full width on small screens
            "translate-x-0": isSidePanelOpen, // Visible when translated to 0
          }
        )}>
          {/* Close Button for Mobile */}
          {isSidePanelOpen && (
            <button
              className="self-end mb-4 p-2 rounded bg-gray-200 focus:outline-none sm:hidden"
              onClick={() => setIsSidePanelOpen(false)}
              aria-label="Close menu"
            >
              <X />
            </button>
          )}
          
          {/* Tools Selection */}
          <div className="mb-6 p-2 bg-white/50 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Tools</h2>
            <div className="flex gap-4">
              <button 
                className={classNames(
                  'p-3 rounded flex items-center justify-center',
                  {
                    'bg-green-500 text-white': selectedTool === TOOLS.PLANT,
                    'bg-white hover:bg-gray-100': selectedTool !== TOOLS.PLANT
                  }
                )}
                onClick={() => {
                  setSelectedTool(TOOLS.PLANT);
                  setCrossPollinationSelection({ first: null, second: null }); // Reset cross-pollination selection
                }}
                aria-label="Plant tool"
              >
                <Flower2 />
              </button>
              <button 
                className={classNames(
                  'p-3 rounded flex items-center justify-center',
                  {
                    'bg-blue-500 text-white': selectedTool === TOOLS.WATER,
                    'bg-white hover:bg-gray-100': selectedTool !== TOOLS.WATER
                  }
                )}
                onClick={() => {
                  setSelectedTool(TOOLS.WATER);
                  setCrossPollinationSelection({ first: null, second: null }); // Reset cross-pollination selection
                }}
                aria-label="Water tool"
              >
                <Droplet />
              </button>
              <button 
                className={classNames(
                  'p-3 rounded flex items-center justify-center',
                  {
                    'bg-red-500 text-white': selectedTool === TOOLS.REMOVE,
                    'bg-white hover:bg-gray-100': selectedTool !== TOOLS.REMOVE
                  }
                )}
                onClick={() => {
                  setSelectedTool(TOOLS.REMOVE);
                  setCrossPollinationSelection({ first: null, second: null }); // Reset cross-pollination selection
                }}
                aria-label="Remove tool"
              >
                <Trash2 />
              </button>
              <button 
                className={classNames(
                  'p-3 rounded flex items-center justify-center',
                  {
                    'bg-purple-500 text-white': selectedTool === TOOLS.CROSS_POLLINATE,
                    'bg-white hover:bg-gray-100': selectedTool !== TOOLS.CROSS_POLLINATE
                  }
                )}
                onClick={() => {
                  setSelectedTool(TOOLS.CROSS_POLLINATE);
                  setCrossPollinationSelection({ first: null, second: null }); // Reset cross-pollination selection
                  addNotification('🔄 Select two adjacent plants to cross-pollinate.', 'info');
                }}
                aria-label="Cross-Pollinate tool"
              >
                <Shuffle />
              </button>
            </div>
          </div>

          {/* Seeds Inventory */}
          <div className="mb-6 p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Seeds</h2>
            <div className="space-y-2">
              {Object.entries(resources.seeds).map(([type, amount]) => (
                <div key={type} className="flex justify-between items-center">
                  <span className="capitalize">{type}:</span>
                  <span className="font-bold">{amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Plant Selection */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Select a Plant</h2>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(PLANTS).map(([key, plant]) => (
                <button
                  key={key}
                  className={classNames(
                    'p-2 border rounded flex items-center justify-center space-x-2',
                    {
                      'bg-blue-500 text-white': selectedPlant === key && selectedTool === TOOLS.PLANT,
                      'bg-white hover:bg-gray-100': !(selectedPlant === key && selectedTool === TOOLS.PLANT),
                      'opacity-50 cursor-not-allowed': resources.seeds[plant.rarity.toLowerCase()] <= 0
                    }
                  )}
                  onClick={() => {
                    if (resources.seeds[plant.rarity.toLowerCase()] > 0) {
                      setSelectedPlant(key);
                      setSelectedTool(TOOLS.PLANT);
                      // Automatically close the side panel on mobile after selection
                      setIsSidePanelOpen(false);
                    }
                  }}
                  disabled={resources.seeds[plant.rarity.toLowerCase()] <= 0}
                  aria-label={`Select ${plant.name}`}
                >
                  <span>{plant.emoji}</span>
                  <span>{plant.name}</span>
                  <span className="text-sm">
                    {resources.seeds[plant.rarity.toLowerCase()]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Special Achievements */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Special Achievements</h2>
            <div className="space-y-2">
              {specialAchievements.map((achievement, index) => (
                <div 
                  key={index} 
                  className="p-3 rounded-lg bg-gradient-to-r from-pink-100 to-purple-100 border border-pink-200"
                >
                  <div className="font-medium text-purple-800">
                    {achievement.name}
                  </div>
                  <div className="text-sm text-pink-600 mt-1">
                    {achievement.message}
                  </div>
                </div>
              ))}
              {specialAchievements.length === 0 && (
                <div className="text-gray-500 italic">
                  Try combining different plants to discover special connections...
                </div>
              )}
            </div>
          </div>
          
          {/* Achievements */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Achievements</h2>
            <ul className="space-y-1">
              {achievements.length === 0 && <li>No achievements yet.</li>}
              {achievements.map((ach, index) => (
                <li key={index} className="flex items-center">
                  <Award className="mr-2 text-yellow-500" />
                  {ach}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Rare Plant Discoveries */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Rare Discoveries</h2>
            <ul className="space-y-1">
              {[...rarePlantDiscoveries].map((type, index) => (
                <li key={index} className="flex items-center">
                  <Sparkles className="mr-2 text-purple-500" />
                  {PLANTS[type].name}
                </li>
              ))}
              {rarePlantDiscoveries.size === 0 && <li>No rare discoveries yet.</li>}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Notifications */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div className={classNames(
            'px-4 py-2 rounded-lg shadow-lg text-white transform transition-all duration-500',
            {
              'bg-green-500': notification.type === 'success',
              'bg-blue-500': notification.type === 'info',
              'bg-yellow-500': notification.type === 'warning',
              'bg-red-500': notification.type === 'error',
              'bg-purple-500': notification.type === 'magic',
              'bg-gradient-to-r from-pink-500 to-purple-500': notification.type === 'special'
            }
          )}>
            {notification.message}
          </div>
        </div>
      )}
      
      {/* Footer with Game Time */}
      <div className="p-4 bg-white/80 backdrop-blur-sm shadow-t border-t border-purple-100 flex justify-between items-center">
        <div className="flex items-center">
          <Clock className="mr-2 text-gray-700" />
          <span>Game Time: {gameTime}s</span>
        </div>
        {/* Pause/Resume Button */}
        <div className="flex items-center">
          <button 
            className={`p-2 rounded ${paused ? 'bg-green-500' : 'bg-red-500'} text-white`}
            onClick={() => setPaused(prev => !prev)}
            aria-label={paused ? "Resume game" : "Pause game"}
          >
            {paused ? 'Resume' : 'Pause'}
          </button>
        </div>
      </div>

      {/* Mobile Side Panel Overlay */}
      {isSidePanelOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden" onClick={() => setIsSidePanelOpen(false)}></div>
      )}
    </div>
  );
};

export default YelebesGardenGame;
