import {
  createStyles,
  Card,
  Image,
  Text,
  Group,
  RingProgress,
  rem,
} from "@mantine/core";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
  },
}));

interface CardWithStatsProps {
  image: string;
  title: string;
  description: string;
  stats: {
    title: string;
    value: string;
  }[];
}

export function CardWithStats({
  image,
  title,
  description,
  stats,
}: CardWithStatsProps) {
  const { classes } = useStyles();

  const items = stats.map((stat) => (
    <div key={stat.title}>
      <Text size="xs" color="dimmed">
        {stat.title}
      </Text>
      <Text weight={500} size="sm">
        {stat.value}
      </Text>
    </div>
  ));

  return (
    <Card withBorder padding="lg" className={classes.card}>
      <Card.Section>
        <Image src={image} alt={title} height={100} />
      </Card.Section>

      <Group position="apart" mt="xl">
        <Text fz="sm" fw={700} className={classes.title}>
          {title}
        </Text>
        <Group spacing={5}>
          <Text fz="xs" c="dimmed">
            80% completed
          </Text>
          <RingProgress size={18} sections={[{ value: 80, color: "blue" }]} />
        </Group>
      </Group>
      <Text mt="sm" mb="md" c="dimmed" fz="xs">
        {description}
      </Text>
      <Card.Section className={classes.footer}>{items}</Card.Section>
    </Card>
  );
}
