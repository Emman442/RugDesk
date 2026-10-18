import { DocketCase } from '../types';

export const INITIAL_CASES: DocketCase[] = [
  {
    id: 'RD-2026-0482',
    tokenSymbol: '$ASTRAL',
    tokenName: 'Astral Finance',
    contractAddress: '0x4f128be204a9198305c74381ba99d21e85093cb',
    chain: 'Ethereum',
    claim: 'Liquidity drained 6 hrs post-launch',
    status: 'reviewed',
    verdict: 'Rug',
    evidenceCount: 14,
    filedDate: '2026-09-02',
    filedBlock: 19842109,
    lossEstimateUsd: '$1,385,210',
    txHashHighlight: '0x9c42b107e997db831ef7806fa498ec15',
    roadmapPromise: 'Liquidity locked for 12 months in Unicrypt contract upon pool launch.',
    validatorVotes: {
      affirmative: 7,
      total: 7,
      consensusBand: 'High Confidence (100%)'
    },
    summary: 'Deployer executed removeLiquidityETHWithPermit() transferring 412.85 ETH to creator EOA 6 hours after claiming a 12-month lock on official channels.',
    evidenceItems: [
      {
        id: 'EX-01',
        title: 'Liquidity Removal Transaction',
        type: 'tx_hash',
        value: '0x9c42b107e997db831ef7806fa498ec15',
        description: 'Call to Uniswap V2 Router removing 850M LP tokens, returning 412.85 ETH to 0x7a31...4e8b.',
        timestamp: '2026-09-02 14:22:04 UTC'
      },
      {
        id: 'EX-02',
        title: 'Roadmap Lock Commitment',
        type: 'archive_link',
        value: 'https://archive.is/astral-gitbook-tokenomics-2026',
        description: 'Official GitBook specification Section 3.2 stating all DEX LP tokens locked until September 2027.',
        timestamp: '2026-08-28 09:15:00 UTC'
      },
      {
        id: 'EX-03',
        title: 'Tornado Cash Mixer Route',
        type: 'tx_hash',
        value: '0x33e89a1200bc45fa81029471de4390b14c33089',
        description: 'Deployer wallet moved 400 ETH in four 100-ETH tranches into privacy contract.',
        timestamp: '2026-09-02 16:04:12 UTC'
      }
    ]
  },
  {
    id: 'RD-2026-0479',
    tokenSymbol: '$NEOAI',
    tokenName: 'Neo Intelligence',
    contractAddress: '0x81b7642a8b30d892408c1f0384da1837482014f',
    chain: 'Ethereum',
    claim: 'Undisclosed team dump of 35% supply',
    status: 'reviewed',
    verdict: 'Rug',
    evidenceCount: 22,
    filedDate: '2026-08-29',
    filedBlock: 19821440,
    lossEstimateUsd: '$2,740,000',
    txHashHighlight: '0x6291aef0319db74284102938472910482910438',
    roadmapPromise: 'Team allocation 15% vested linearly over 24 months with 6 month cliff.',
    validatorVotes: {
      affirmative: 9,
      total: 9,
      consensusBand: 'High Confidence (100%)'
    },
    summary: 'Deployer dispersed 35,000,000 NEOAI tokens through 14 intermediate wallets before dumping across 3 automated liquidity pools within 45 minutes.',
    evidenceItems: [
      {
        id: 'EX-01',
        title: 'Cluster Distribution Batch',
        type: 'tx_hash',
        value: '0x6291aef0319db74284102938472910482910438',
        description: 'Disperse contract call sending 2.5M tokens to 14 sybil addresses funded by same gas wallet.',
        timestamp: '2026-08-29 02:11:15 UTC'
      },
      {
        id: 'EX-02',
        title: 'Whitepaper Tokenomics Clause',
        type: 'roadmap_url',
        value: 'https://ipfs.io/ipfs/QmNeoAiWhitepaperV1#page=12',
        description: 'Stated 6-month hard lock before any founder tokens become transferable.',
        timestamp: '2026-08-10 18:00:00 UTC'
      }
    ]
  },
  {
    id: 'RD-2026-0471',
    tokenSymbol: '$SOLAR',
    tokenName: 'Solaris DAO',
    contractAddress: '0x2d99c4a8f93e312984920485928374928376a81',
    chain: 'Ethereum',
    claim: 'Treasury multi-sig compromised / drained',
    status: 'defended',
    verdict: 'Contested',
    evidenceCount: 9,
    filedDate: '2026-08-21',
    filedBlock: 19789312,
    lossEstimateUsd: '$610,000',
    txHashHighlight: '0x17fa48293847192837492837492837492837491',
    roadmapPromise: 'Treasury protected by 3-of-5 Gnosis Safe with public keyholders.',
    validatorVotes: {
      affirmative: 4,
      total: 8,
      consensusBand: 'Split Docket (50%)'
    },
    summary: 'Project core contributors filed formal defense with third-party post-mortem claiming external private key compromise rather than malicious team insider extraction.',
    evidenceItems: [
      {
        id: 'EX-01',
        title: 'Multi-sig Transaction',
        type: 'tx_hash',
        value: '0x17fa48293847192837492837492837492837491',
        description: 'Safe transaction executing transfer of 180 ETH to unverified contract.',
        timestamp: '2026-08-21 21:40:02 UTC'
      },
      {
        id: 'EX-02',
        title: 'Team Defense Post-Mortem',
        type: 'archive_link',
        value: 'https://mirror.xyz/solarisdao.eth/post-mortem-report',
        description: 'Submission detailing phishing attack against signer #2 and signer #3 hardware devices.',
        timestamp: '2026-08-23 11:20:00 UTC'
      }
    ]
  },
  {
    id: 'RD-2026-0465',
    tokenSymbol: '$VORTEX',
    tokenName: 'Vortex Protocol',
    contractAddress: '0xb431782e4829103847291048291038472912e90',
    chain: 'Ethereum',
    claim: 'Unannounced mint function called by dev',
    status: 'reviewed',
    verdict: 'Rug',
    evidenceCount: 18,
    filedDate: '2026-08-14',
    filedBlock: 19741088,
    lossEstimateUsd: '$920,000',
    txHashHighlight: '0x889214710928374910293847291029384719283',
    roadmapPromise: 'Hard cap of 10,000,000 tokens fixed in immutable contract bytecode.',
    validatorVotes: {
      affirmative: 8,
      total: 8,
      consensusBand: 'High Confidence (100%)'
    },
    summary: 'Token contract contained hidden mintAccessOwner modifier bypassing published total supply limit; dev minted 50M new units into Uniswap pool.',
    evidenceItems: [
      {
        id: 'EX-01',
        title: 'Hidden Mint Execution',
        type: 'tx_hash',
        value: '0x889214710928374910293847291029384719283',
        description: 'Transaction invoking mintOverride() producing 50,000,000 new units.',
        timestamp: '2026-08-14 06:12:44 UTC'
      },
      {
        id: 'EX-02',
        title: 'Verified Bytecode Decompilation',
        type: 'archive_link',
        value: 'https://etherscan.io/address/0xb43178...#code',
        description: 'Decompiled selector 0x12a9ef showing backdoor owner-only mint capability.',
        timestamp: '2026-08-14 08:30:19 UTC'
      }
    ]
  },
  {
    id: 'RD-2026-0458',
    tokenSymbol: '$MEMEKING',
    tokenName: 'Meme King',
    contractAddress: '0x76c284910293847192837492810293847195d12',
    chain: 'Ethereum',
    claim: 'Dev wallet sold 15% slippage claim',
    status: 'open',
    verdict: 'Insufficient',
    evidenceCount: 3,
    filedDate: '2026-08-08',
    filedBlock: 19702914,
    lossEstimateUsd: '$84,000',
    txHashHighlight: '0x491829384719283749102938471928374918273',
    roadmapPromise: 'Fair launch meme token with no formal vesting schedule.',
    validatorVotes: {
      affirmative: 2,
      total: 6,
      consensusBand: 'Below Quorum (33%)'
    },
    summary: 'Filer claims dev address dumped tokens, but preliminary review indicates wallet was an early public DEX buyer with no proven affiliation to contract deployer.',
    evidenceItems: [
      {
        id: 'EX-01',
        title: 'DEX Sell Swap',
        type: 'tx_hash',
        value: '0x491829384719283749102938471928374918273',
        description: 'Swap of 400M MEMEKING for 24 ETH on Uniswap V2.',
        timestamp: '2026-08-08 19:44:11 UTC'
      }
    ]
  }
];
