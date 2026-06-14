const MONTH_INDEX_BY_NAME = {
  apr: 3,
  april: 3,
  aug: 7,
  august: 7,
  dec: 11,
  december: 11,
  feb: 1,
  february: 1,
  jan: 0,
  january: 0,
  jul: 6,
  july: 6,
  jun: 5,
  june: 5,
  mar: 2,
  march: 2,
  may: 4,
  nov: 10,
  november: 10,
  oct: 9,
  october: 9,
  sep: 8,
  sept: 8,
  september: 8,
}

const DAY_IN_MS = 24 * 60 * 60 * 1000

const monthYearFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
})

const fullDateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

function isValidDate(year, monthIndex, day) {
  if (!Number.isInteger(year) || !Number.isInteger(monthIndex) || !Number.isInteger(day)) {
    return false
  }

  const date = new Date(year, monthIndex, day)

  return (
    date.getFullYear() === year &&
    date.getMonth() === monthIndex &&
    date.getDate() === day
  )
}

function getStartOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function parseRelativeDate(value) {
  const normalized = value.trim().toLowerCase()
  const today = getStartOfDay(new Date())

  if (normalized === 'today') {
    return { date: today, precision: 'day' }
  }

  if (normalized === 'yesterday') {
    return { date: new Date(today.getTime() - DAY_IN_MS), precision: 'day' }
  }

  return null
}

function parseIsoDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim())

  if (!match) {
    return null
  }

  const year = Number(match[1])
  const monthIndex = Number(match[2]) - 1
  const day = Number(match[3])

  if (!isValidDate(year, monthIndex, day)) {
    return null
  }

  return {
    date: new Date(year, monthIndex, day),
    precision: 'day',
  }
}

function parseNumericDayDate(value) {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value.trim())

  if (!match) {
    return null
  }

  const day = Number(match[1])
  const monthIndex = Number(match[2]) - 1
  const year = Number(match[3])

  if (!isValidDate(year, monthIndex, day)) {
    return null
  }

  return {
    date: new Date(year, monthIndex, day),
    precision: 'day',
  }
}

function parseNumericMonthDate(value) {
  const match = /^(\d{2})\.(\d{4})$/.exec(value.trim())

  if (!match) {
    return null
  }

  const monthIndex = Number(match[1]) - 1
  const year = Number(match[2])

  if (!isValidDate(year, monthIndex, 1)) {
    return null
  }

  return {
    date: new Date(year, monthIndex, 1),
    precision: 'month',
  }
}

function parseNamedMonthDate(value) {
  const trimmedValue = value.trim()
  const fullDateMatch = /^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/.exec(trimmedValue)

  if (fullDateMatch) {
    const monthIndex = MONTH_INDEX_BY_NAME[fullDateMatch[1].toLowerCase()]
    const day = Number(fullDateMatch[2])
    const year = Number(fullDateMatch[3])

    if (!isValidDate(year, monthIndex, day)) {
      return null
    }

    return {
      date: new Date(year, monthIndex, day),
      precision: 'day',
    }
  }

  const monthYearMatch = /^([A-Za-z]+)\s+(\d{4})$/.exec(trimmedValue.replace(',', ''))

  if (!monthYearMatch) {
    return null
  }

  const monthIndex = MONTH_INDEX_BY_NAME[monthYearMatch[1].toLowerCase()]
  const year = Number(monthYearMatch[2])

  if (!isValidDate(year, monthIndex, 1)) {
    return null
  }

  return {
    date: new Date(year, monthIndex, 1),
    precision: 'month',
  }
}

function parseContentDate(value = '') {
  if (!value) {
    return null
  }

  return (
    parseRelativeDate(value) ??
    parseIsoDate(value) ??
    parseNumericDayDate(value) ??
    parseNumericMonthDate(value) ??
    parseNamedMonthDate(value)
  )
}

export function formatContentDate(value = '') {
  const parsedDate = parseContentDate(value)

  if (!parsedDate) {
    return value
  }

  if (parsedDate.precision === 'month') {
    return monthYearFormatter.format(parsedDate.date)
  }

  const today = getStartOfDay(new Date())
  const differenceInDays = Math.round(
    (today.getTime() - getStartOfDay(parsedDate.date).getTime()) / DAY_IN_MS,
  )

  if (differenceInDays === 0) {
    return 'Today'
  }

  if (differenceInDays === 1) {
    return 'Yesterday'
  }

  return fullDateFormatter.format(parsedDate.date)
}

export function getContentDateSortValue(value = '') {
  const parsedDate = parseContentDate(value)
  return parsedDate ? parsedDate.date.getTime() : 0
}

const TIMELINE_META_RULES = [
  {
    kind: 'created',
    label: 'Created',
    pattern: /^Created(?:\s+at)?\s+(.+)$/i,
  },
  {
    kind: 'started',
    label: 'Started',
    pattern: /^Started(?:\s+at)?\s+(.+)$/i,
  },
  {
    kind: 'completed',
    label: 'Completed',
    pattern: /^Completed(?:\s+at)?\s+(.+)$/i,
  },
  {
    kind: 'live',
    label: 'Live since',
    pattern: /^Live(?:\s+since)?\s+(.+)$/i,
  },
  {
    kind: 'maintained',
    label: 'Maintained through',
    pattern: /^Maintained(?:\s+through)?\s+(.+)$/i,
  },
  {
    kind: 'updated',
    label: 'Updated',
    pattern: /^Updated(?:\s+at|\s+through)?\s+(.+)$/i,
  },
  {
    kind: 'launched',
    label: 'Launched',
    pattern: /^Launched(?:\s+at)?\s+(.+)$/i,
  },
  {
    kind: 'released',
    label: 'Released',
    pattern: /^Released(?:\s+at)?\s+(.+)$/i,
  },
]

export function splitTimelineMeta(meta = []) {
  return meta.reduce(
    (result, item) => {
      const normalizedItem = item.trim().toLowerCase()

      if (normalizedItem === 'completed') {
        return {
          timelineItems: result.timelineItems,
          metaItems: result.metaItems,
          statusItem: {
            kind: 'completed',
            label: 'Completed',
          },
        }
      }

      if (normalizedItem === 'in development') {
        return {
          timelineItems: result.timelineItems,
          metaItems: result.metaItems,
          statusItem: {
            kind: 'in-development',
            label: 'In Development',
          },
        }
      }

      if (normalizedItem === 'live') {
        return {
          timelineItems: result.timelineItems,
          metaItems: result.metaItems,
          statusItem: {
            kind: 'live',
            label: 'Live',
          },
        }
      }

      const matchedRule = TIMELINE_META_RULES.find((rule) => rule.pattern.test(item))

      if (matchedRule) {
        const [, value = ''] = item.match(matchedRule.pattern) ?? []

        return {
          timelineItems: [
            ...result.timelineItems,
            {
              kind: matchedRule.kind,
              label: matchedRule.label,
              value: value.trim(),
            },
          ],
          metaItems: result.metaItems,
          statusItem: result.statusItem,
        }
      }

      return {
        timelineItems: result.timelineItems,
        metaItems: [...result.metaItems, item],
        statusItem: result.statusItem,
      }
    },
    { timelineItems: [], metaItems: [], statusItem: null },
  )
}

export function formatTimelineSummary(timelineItems = []) {
  if (!timelineItems.length) {
    return ''
  }

  return timelineItems
    .map((item) => {
      const formattedValue = formatContentDate(item.value)

      if (timelineItems.length === 1 && item.kind === 'created') {
        return formattedValue
      }

      return `${item.label} ${formattedValue}`
    })
    .join(' / ')
}
