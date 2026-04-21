import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Award,
  BarChart3,
  Cloud,
  Github,
  Layers3,
  Linkedin,
  Rocket,
  ShieldCheck,
  Terminal,
} from "lucide-react";

const sections = [
  { id: "inicio", label: "Início" },
  { id: "projetos", label: "Projetos" },
  { id: "stack", label: "Stack" },
  { id: "impacto", label: "Impacto" },
  { id: "contato", label: "Contato" },
];

const projectFilters = ["Todos", "IaC", "GitOps", "Observabilidade", "Reliability Tools", "FinOps", "Education"];

const projects = [
  {
    category: "IaC",
    eyebrow: "terraform-modules + atlantis",
    title: "Cadeia de infraestrutura com módulos reutilizáveis, revisão de risco e apply governado.",
    description:
      "Este bloco reúne a espinha dorsal de infraestrutura como código da workspace: import de legado, módulos Terraform, análise de risco em PR e execução controlada via Atlantis.",
    points: [
      "Terraform modules, import e CI para validar stacks antes da mudança",
      "Risk analyzer com SARIF e classificação de blast radius em PRs",
      "Atlantis como ponte segura entre revisão, plan e apply controlado",
    ],
    repos: ["terraform-import", "terraform-modules", "terraform-pr-risk-analyzer", "atlantis"],
    badge: "IaC Governance",
  },
  {
    category: "GitOps",
    eyebrow: "argocd + gitops + karpenter",
    title: "GitOps opinativo para EKS com progressive delivery, platform addons e autoscaling.",
    description:
      "A trilha GitOps costura Argo CD, Rollouts, Karpenter e observabilidade para mostrar uma plataforma que entrega aplicações com menos atrito e mais visibilidade operacional.",
    points: [
      "Bootstrap da plataforma, root app e promoção dev -> stage -> prod",
      "AnalysisTemplate, rollback e upgrade readiness no fluxo de plataforma",
      "Karpenter e monitoring conectados ao golden path GitOps",
    ],
    repos: ["argocd", "gitops", "karpenter", "kubernetes-upgrade-readiness-analyzer"],
    badge: "Platform Engineering",
  },
  {
    category: "Observabilidade",
    eyebrow: "observabilidade + slo-factory",
    title: "Telemetria, SLO e scorecard como base para operar serviços com critério.",
    description:
      "Os bundles de SLO, dashboards e scorecards ajudam a sair da conversa abstrata sobre confiabilidade e chegar em artefatos versionáveis e backlog priorizado.",
    points: [
      "Dashboards e alertas reutilizáveis para plataforma e workloads",
      "SLO Factory com AnalysisTemplate para Argo Rollouts",
      "Platform scorecard com badge, tendência e backlog priorizado",
    ],
    repos: ["observabilidade", "slo-factory", "platform-scorecard"],
    badge: "Observability",
  },
  {
    category: "Reliability Tools",
    eyebrow: "aws-sre-doctor + incident-timeline-builder",
    title: "Tooling operacional para diagnosticar, correlacionar evidências e executar resposta segura.",
    description:
      "A família de CLIs operacionais foi construída para incidentes reais: bundles de diagnóstico, timeline, runbooks auditáveis e evidências de DR.",
    points: [
      "AWS SRE Doctor com incident bundles portáteis e hipóteses priorizadas",
      "Timeline builder com fatos confirmados, hipóteses e rascunho de postmortem",
      "Runbook executor com runners guardados, lock e redaction de segredos",
    ],
    repos: ["aws-sre-doctor", "incident-timeline-builder", "runbook-executor", "backup-restore-validator"],
    badge: "Reliability Operations",
  },
  {
    category: "FinOps",
    eyebrow: "cloud-cost-waste-finder + secrets-drift-detector",
    title: "Eficiência operacional com visão de custo, drift e risco de configuração entre ambientes.",
    description:
      "Este recorte mostra como custo e confiabilidade andam juntos: desperdício cloud, drift de secrets, score de restore e relatórios acionáveis por owner.",
    points: [
      "Snapshot comparison com CSV e recorte por owner/cost center",
      "Secrets drift com score por ambiente e chaves críticas destacadas",
      "Readiness de backup ajustada por criticidade do workload",
    ],
    repos: ["cloud-cost-waste-finder", "secrets-drift-detector", "backup-restore-validator"],
    badge: "FinOps + Resilience",
  },
  {
    category: "Education",
    eyebrow: "portfolio + plano_estudos_sre",
    title: "Narrativa pública, labs e trilhas para aprender SRE construindo repositórios reais.",
    description:
      "A camada de visibilidade conecta os projetos técnicos a uma história coerente de aprendizagem, portfólio e referência para estudos guiados por prática.",
    points: [
      "Portfolio organizado por categoria e ecossistema funcional",
      "Plano de estudos amarrado a labs práticos da própria workspace",
      "Workspace tools e Jira como camada de enablement e governança",
    ],
    repos: ["portfolio", "plano_estudos_sre", "workspace-tools", "jira"],
    badge: "Education + Enablement",
  },
];

const capabilities = [
  {
    icon: Cloud,
    title: "Cloud Architecture",
    text: "Desenho de ambientes resilientes, seguros e preparados para crescer sem gambiarras cósmicas.",
  },
  {
    icon: Terminal,
    title: "Infrastructure as Code",
    text: "Provisionamento reproduzível com Terraform, módulos reutilizáveis e padrões sólidos de ambiente.",
  },
  {
    icon: Rocket,
    title: "Release Engineering",
    text: "Pipelines enxutas, seguras e com rollback claro para acelerar entrega sem sacrificar estabilidade.",
  },
  {
    icon: ShieldCheck,
    title: "Governança e Segurança",
    text: "Políticas, observabilidade, least privilege e controles práticos para reduzir risco no mundo real.",
  },
  {
    icon: BarChart3,
    title: "Observabilidade e Custos",
    text: "Logs, métricas, tracing e leitura de custo com contexto para orientar decisão técnica e de negócio.",
  },
  {
    icon: Layers3,
    title: "Plataformas Internas",
    text: "Estruturas que simplificam o dia a dia do time e removem atrito de operação, deploy e suporte.",
  },
];

const metrics = [
  { value: "Kubernetes", label: "Orquestração moderna para plataformas em escala" },
  { value: "SRE", label: "Foco em confiabilidade, operação e escala" },
  { value: "AWS + IaC", label: "Cloud, automação e ambientes padronizados" },
  { value: "FinOps", label: "Custos, governança e eficiência operacional" },
];

const sreSignalCards = [
  {
    value: "99.95%",
    label: "Availability",
    text: "Disponibilidade como meta de engenharia, não como desejo otimista em reunião.",
  },
  {
    value: "MTTR ↓",
    label: "Recovery",
    text: "Recuperação mais rápida com diagnóstico melhor, runbooks claros e menos caos operacional.",
  },
  {
    value: "Deploy Seguro",
    label: "Release",
    text: "Entrega com revisão, rollback previsível e menos chance de surpresas mutantes em produção.",
  },
  {
    value: "IaC First",
    label: "Platform",
    text: "Infraestrutura versionada, reproduzível e tratada como produto interno da operação.",
  },
];

const stackGroups = [
  {
    title: "Cloud e Plataforma",
    items: ["AWS", "EC2", "ECS", "Kubernetes", "Elasticidade", "VPC", "ALB", "Route 53", "RDS", "EFS"],
  },
  {
    title: "Infra e Automação",
    items: ["Terraform", "OpenTofu", "GitHub Actions", "Jenkins", "Bash", "Python", "Ansible"],
  },
  {
    title: "Observabilidade e Operação",
    items: ["CloudWatch", "OpenTelemetry", "Prometheus", "Grafana", "Logs", "Runbooks", "SLO/SLI"],
  },
];

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white/80 backdrop-blur">
      {children}
    </span>
  );
}

function SectionTitle({ eyebrow, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.75 }}
      className="mx-auto max-w-3xl text-center"
    >
      <p className="mb-4 text-sm uppercase tracking-[0.3em] text-white/50">{eyebrow}</p>
      <h2 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">{title}</h2>
      <p className="mt-6 text-lg leading-8 text-white/65 md:text-xl">{description}</p>
    </motion.div>
  );
}

function Reveal({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 38, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ParallaxPanel({ children, className = "" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.45, 1, 1, 0.7]);

  return (
    <motion.div ref={ref} style={{ y, opacity }} className={className}>
      {children}
    </motion.div>
  );
}

export default function PortfolioAppleInspired() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [activeProject, setActiveProject] = useState(0);
  const filteredProjects = useMemo(
    () => (activeFilter === "Todos" ? projects : projects.filter((project) => project.category === activeFilter)),
    [activeFilter],
  );
  useEffect(() => {
    setActiveProject(0);
  }, [activeFilter]);
  const currentProject = useMemo(
    () => filteredProjects[activeProject] ?? filteredProjects[0] ?? projects[0],
    [activeProject, filteredProjects],
  );
  const { scrollYProgress } = useScroll();
  const progressScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <motion.div
        style={{ scaleX: progressScaleX }}
        className="fixed left-0 top-0 z-[70] h-[2px] w-full origin-left bg-white/85"
      />

      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-[-6rem] h-[24rem] w-[24rem] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute right-[-8rem] top-[20rem] h-[28rem] w-[28rem] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_30%,rgba(255,255,255,0.02))]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/55 backdrop-blur-2xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <a href="#inicio" className="text-sm font-medium uppercase tracking-[0.25em] text-white/85">
            TS
          </a>

          <div className="hidden gap-6 md:flex">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-sm text-white/65 transition hover:text-white"
              >
                {section.label}
              </a>
            ))}
          </div>

          <a
            href="#contato"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white px-4 py-2 text-sm font-medium text-black transition hover:scale-[1.02]"
          >
            Vamos conversar <ArrowRight className="h-4 w-4" />
          </a>
        </nav>
      </header>

      <main>
        <section id="inicio" className="relative mx-auto flex min-h-[92vh] max-w-7xl items-center px-6 py-24 lg:px-10">
          <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6 text-sm uppercase tracking-[0.35em] text-white/45"
              >
                Tharlesson Souza • Engenheiro SRE • Cloud • DevOps
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.05 }}
                className="max-w-5xl text-5xl font-semibold tracking-tight text-white md:text-7xl lg:text-[5.6rem] lg:leading-[0.98]"
              >
                Cloud em escala.
                <br />
                Automação com propósito.
                <br />
                Confiabilidade de verdade.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.12 }}
                className="mt-8 max-w-2xl text-lg leading-8 text-white/65 md:text-xl"
              >
                Profissional com foco em Cloud Computing, DevOps e Site Reliability Engineering,
                construindo plataformas mais previsíveis com AWS, infraestrutura como código,
                automação, governança e eficiência operacional.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.18 }}
                className="mt-10 flex flex-wrap gap-3"
              >
                <Pill>AWS</Pill>
                <Pill>Terraform</Pill>
                <Pill>Kubernetes</Pill>
                <Pill>GitHub Actions</Pill>
                <Pill>Observabilidade</Pill>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.25 }}
                className="mt-10 flex flex-wrap gap-4"
              >
                <a
                  href="#projetos"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:scale-[1.02]"
                >
                  Ver projetos <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contato"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Falar comigo
                </a>
              </motion.div>
            </div>

            <ParallaxPanel className="relative">
              <div className="absolute -inset-6 rounded-[2rem] bg-white/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl">
                <div className="rounded-[1.6rem] border border-white/10 bg-black/60 p-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-5">
                    <div>
                      <p className="text-sm text-white/45">Perfil</p>
                      <h3 className="mt-1 text-2xl font-semibold">Tharlesson Souza</h3>
                      <p className="mt-2 text-sm text-white/55">Engenheiro SRE • Cloud • DevOps</p>
                    </div>
                    <Award className="h-8 w-8 text-white/80" />
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {metrics.map((metric) => (
                      <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="text-2xl font-semibold">{metric.value}</div>
                        <p className="mt-2 text-sm leading-6 text-white/55">{metric.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.02] p-5">
                    <p className="text-sm text-white/45">Posicionamento</p>
                    <p className="mt-3 text-lg leading-8 text-white/80">
                      Engenheiro SRE com foco em AWS, automação, governança, infraestrutura como código e plataformas confiáveis. Minha atuação combina visão operacional, arquitetura prática e melhoria contínua para reduzir atrito, aumentar previsibilidade e sustentar crescimento com mais controle.
                    </p>
                  </div>
                </div>
              </div>
            </ParallaxPanel>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
          <div className="grid gap-4 md:grid-cols-4">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur"
              >
                <div className="text-3xl font-semibold tracking-tight">{metric.value}</div>
                <div className="mt-3 text-sm leading-6 text-white/55">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="projetos" className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
          <SectionTitle
            eyebrow="Projetos"
            title="Casos reais transformados em narrativa visual."
            description="Aqui o portfólio deixa de ser genérico e passa a espelhar o ecossistema real da workspace, organizado por categoria para mostrar como as peças se conectam."
          />

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {projectFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  activeFilter === filter
                    ? "border-white/30 bg-white text-black"
                    : "border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.08]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[0.4fr_0.6fr]">
            <div className="space-y-4">
              {filteredProjects.map((project, index) => (
                <motion.button
                  key={project.title}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  onClick={() => setActiveProject(index)}
                  className={`w-full rounded-[1.75rem] border p-6 text-left transition ${
                    activeProject === index
                      ? "border-white/25 bg-white/10"
                      : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-white/45">{project.eyebrow}</p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight">{project.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/55">{project.category} • {project.badge}</p>
                </motion.button>
              ))}
            </div>

            <motion.div
              key={currentProject.title}
              initial={{ opacity: 0, y: 28, scale: 0.985 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.03] p-8 md:p-10"
            >
              <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white/70">
                {currentProject.badge}
              </div>
              <h3 className="mt-6 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
                {currentProject.title}
              </h3>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">{currentProject.description}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                {currentProject.repos.map((repo) => (
                  <Pill key={repo}>{repo}</Pill>
                ))}
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {currentProject.points.map((point) => (
                  <div key={point} className="rounded-2xl border border-white/10 bg-black/25 p-5">
                    <p className="text-base leading-7 text-white/80">{point}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 rounded-[1.75rem] border border-white/10 bg-black/25 p-6">
                <p className="text-sm text-white/45">Evidências e próximos artefatos</p>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {["screenshots", "diagramas", "artefatos html/json"].map((item) => (
                    <div
                      key={item}
                      className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] text-sm text-white/35"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="stack" className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
          <SectionTitle
            eyebrow="Stack"
            title="Tecnologia organizada em blocos claros."
            description="A stack é apresentada de forma estruturada, organizada por domínio de atuação e capacidade técnica. O objetivo é evidenciar como cada tecnologia contribui para confiabilidade, automação, escalabilidade e eficiência operacional."
          />

          <div className="mt-16 grid gap-5 lg:grid-cols-3">
            {stackGroups.map((group, index) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7"
              >
                <h3 className="text-2xl font-semibold tracking-tight">{group.title}</h3>
                <div className="mt-6 flex flex-wrap gap-3">
                  {group.items.map((item) => (
                    <Pill key={item}>{item}</Pill>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon;
              return (
                <motion.div
                  key={capability.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  className="rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-7"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
                    <Icon className="h-6 w-6 text-white/85" />
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold tracking-tight">{capability.title}</h3>
                  <p className="mt-4 text-base leading-7 text-white/60">{capability.text}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section id="impacto" className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
          <SectionTitle
            eyebrow="Impacto"
            title="Menos descrição. Mais prova de valor."
            description="O foco aqui está em evidenciar melhorias práticas em confiabilidade, automação, observabilidade e operação, conectando decisões técnicas a impacto real na plataforma."
          />

          <div className="mt-16 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <Reveal className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 md:p-10">
              <p className="text-sm uppercase tracking-[0.3em] text-white/45">Timeline de evolução</p>
              <div className="mt-10 space-y-8">
                {[
                  {
                    year: "01",
                    title: "Mapeamento do ambiente",
                    text: "Descoberta de serviços, riscos, gargalos e dependências operacionais.",
                  },
                  {
                    year: "02",
                    title: "Padronização da entrega",
                    text: "Infra como código, pipelines reutilizáveis e governança mínima viável.",
                  },
                  {
                    year: "03",
                    title: "Escala com previsibilidade",
                    text: "Observabilidade, custo por domínio e decisões guiadas por telemetria.",
                  },
                ].map((item) => (
                  <div key={item.title} className="grid gap-4 md:grid-cols-[90px_1fr]">
                    <div className="text-4xl font-semibold tracking-tight text-white/35">{item.year}</div>
                    <div>
                      <h3 className="text-2xl font-semibold tracking-tight">{item.title}</h3>
                      <p className="mt-2 max-w-xl text-base leading-7 text-white/60">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="space-y-5" delay={0.08}>
              <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.03] p-8">
                <p className="text-sm uppercase tracking-[0.3em] text-white/45">Resultados que podem entrar aqui</p>
                <div className="mt-6 space-y-5">
                  {[
                    "Governança e tagging para ambientes AWS multi-conta",
                    "Pipelines reutilizáveis para ECS e Kubernetes com Terraform e CI/CD",
                    "Troubleshooting prático de Redis, RDS e workloads críticos",
                    "FinOps aplicado para leitura e otimização de custos cloud",
                  ].map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-black/25 p-4 text-white/80">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
                <p className="text-sm uppercase tracking-[0.3em] text-white/45">Sinal acima do ruído</p>
                <p className="mt-5 text-lg leading-8 text-white/65">
                  Em SRE, sofisticação não é excesso. É controle operacional bem exposto. Use poucos elementos, boa hierarquia visual, métricas relevantes e animações discretas. O visual precisa inspirar confiança antes mesmo da leitura completa.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {sreSignalCards.map((card, index) => (
                    <motion.div
                      key={card.label}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.35 }}
                      transition={{ duration: 0.45, delay: index * 0.08 }}
                      className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5"
                    >
                      <p className="text-2xl font-semibold tracking-tight text-white">{card.value}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.25em] text-white/45">{card.label}</p>
                      <p className="mt-3 text-sm leading-6 text-white/60">{card.text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="contato" className="mx-auto max-w-7xl px-6 pb-24 pt-12 lg:px-10">
          <Reveal className="overflow-hidden rounded-[2.2rem] border border-white/10 bg-white/[0.04] p-8 md:p-12">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-white/45">Contato</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
                  Vamos construir algo bonito,
                  <br />
                  rápido e confiável.
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
                  Conecto confiabilidade, automação e governança para transformar operação em plataforma. Este espaço foi atualizado para refletir seu posicionamento público e seus casos reais mais fortes em AWS, SRE, DevOps, IaC e eficiência operacional.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <a
                  href="https://github.com/tharlesson"
                  className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white px-5 py-3 text-sm font-medium text-black"
                >
                  <Github className="h-4 w-4" /> GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/tharlesson/"
                  className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white"
                >
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
    </div>
  );
}
