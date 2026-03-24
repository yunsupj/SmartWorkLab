-- Migration: Seed 5 Placeholder Tech Posts for Phase 5
-- Date: 2026-03-24

INSERT INTO tech_posts (slug, locale, title, subtitle, excerpt, body_mdx, tags, series, published_at, is_published, read_time_min)
VALUES
(
  'vton-multi-item-synthesis',
  'en',
  'VTON Optimization: Multi-Item Synthesis in Single Inference',
  'Achieving sub-second latency for virtual try-on using stable diffusion.',
  'How we optimized Virtual Try-On (VTON) pipelines to synthesize multiple garments in a single inference pass, reducing cloud GPU costs by 60%.',
  '# VTON Optimization\n\nComing soon...',
  ARRAY['VTON', 'Diffusion', 'PyTorch', 'Optimization'],
  'ML Paper Reviews',
  now(),
  true,
  5
),
(
  'pickle-ai-architecture',
  'en',
  'Pickle AI Architecture: Scaling Real-Time Computer Vision',
  'Building a distributed computer vision pipeline for amateur sports.',
  'An architectural deep dive into Pickle AI, our real-time computer vision system that tracks and scores pickleball games using edge devices.',
  '# Pickle AI Architecture\n\nComing soon...',
  ARRAY['Computer Vision', 'Edge Computing', 'Real-Time'],
  'Spatial AI',
  now(),
  true,
  8
),
(
  'enterprise-rag-soc2',
  'en',
  'Enterprise RAG: Building SOC-2 Compliant Knowledge Bases',
  'Securing vector databases and implementing strict RBAC for LLMs.',
  'A blueprint for deploying Retrieval-Augmented Generation (RAG) systems that meet enterprise security standards, including VPCs and role-based access control.',
  '# Enterprise RAG\n\nComing soon...',
  ARRAY['RAG', 'Security', 'LLM', 'Enterprise'],
  'Agentic Workflows',
  now(),
  true,
  6
),
(
  'h3-spatial-ai',
  'en',
  'Spatial AI: Dynamic Feed Generation with H3 Sharding',
  'Using Uber''s H3 grid system for lightning-fast geospatial queries.',
  'Learn how we implemented Uber''s H3 spatial indexing to shard content and serve hyper-local feeds for millions of users with sub-50ms latency.',
  '# Spatial AI with H3\n\nComing soon...',
  ARRAY['Geospatial', 'H3', 'PostGIS', 'Scaling'],
  'Spatial AI',
  now(),
  true,
  7
),
(
  'ai-roi-report-2026',
  'en',
  'The 2026 AI ROI Report: What Actually Drives Business Value',
  'An empirical analysis of 50+ enterprise AI deployments.',
  'We analyzed over 50 B2B AI implementations to determine which use cases generate actual positive ROI vs which are just expensive toys.',
  '# AI ROI Report\n\nComing soon...',
  ARRAY['Strategy', 'ROI', 'Business'],
  'Agentic Workflows',
  now(),
  true,
  4
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  excerpt = EXCLUDED.excerpt,
  is_published = EXCLUDED.is_published,
  published_at = EXCLUDED.published_at;
