import { ArrowDownRight, ArrowUpRight, Banknote, Landmark, Receipt } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const METRICS = [
  { label: 'Total revenue (FY 2026)', value: 'Rs 1.84B', delta: '+8.2%', up: true },
  { label: 'Fees collected', value: 'Rs 72.4M', delta: '+3.1%', up: true },
  { label: 'Outstanding balances', value: 'Rs 14.8M', delta: '-2.4%', up: false },
  { label: 'Active payers', value: '8,140', delta: '+1.9%', up: true },
];

const CATEGORY_SPEND = [
  { label: 'Instruction & learning', value: 42, color: 'bg-primary' },
  { label: 'Scholarships & bursaries', value: 18, color: 'bg-info' },
  { label: 'Facilities & estates', value: 21, color: 'bg-chart-3' },
  { label: 'Student services', value: 11, color: 'bg-chart-5' },
  { label: 'Admin & operations', value: 8, color: 'bg-chart-2' },
];

const COLLECTION_RATE = [
  { month: 'May', rate: 88 },
  { month: 'Jun', rate: 92 },
  { month: 'Jul', rate: 90 },
  { month: 'Aug', rate: 95 },
  { month: 'Sep', rate: 93 },
];

const TRANSACTIONS = [
  {
    id: 'INV-2041',
    student: 'Sanju Perera',
    item: 'Tuition – term 3',
    amount: 'Rs 485,000',
    status: 'Paid',
  },
  {
    id: 'INV-2042',
    student: 'Mihini Silva',
    item: 'Accommodation – hall',
    amount: 'Rs 60,000',
    status: 'Pending',
  },
  {
    id: 'INV-2043',
    student: 'Dilan Fernando',
    item: 'Lab fees – CSE',
    amount: 'Rs 12,500',
    status: 'Paid',
  },
  {
    id: 'INV-2044',
    student: 'Tharushi Weerasinghe',
    item: 'Tuition – term 3',
    amount: 'Rs 485,000',
    status: 'Partial',
  },
];

export function AdminFinancePage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Finance analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          Fee collection, budget utilisation and payer insights for the current financial year.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {METRICS.map((metric) => {
          const DeltaIcon = metric.up ? ArrowUpRight : ArrowDownRight;
          return (
            <Card key={metric.label} size="sm">
              <CardHeader>
                <CardDescription>{metric.label}</CardDescription>
                <CardTitle className="text-xl font-semibold text-foreground">
                  {metric.value}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium ${
                    metric.up ? 'text-success' : 'text-destructive'
                  }`}
                >
                  <DeltaIcon className="size-3.5" />
                  {metric.delta} vs last year
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card size="sm">
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Banknote className="size-4 text-primary" />
              Budget utilisation
            </CardTitle>
            <CardDescription>Where this year&rsquo;s spend is going.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5">
            {CATEGORY_SPEND.map((entry) => (
              <div key={entry.label} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{entry.label}</span>
                  <span className="font-medium text-foreground">{entry.value}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${entry.color}`}
                    style={{ width: `${entry.value}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Landmark className="size-4 text-primary" />
              Collection rate
            </CardTitle>
            <CardDescription>Percentage of fees settled on time.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-end gap-2">
            {COLLECTION_RATE.map((entry) => (
              <div key={entry.month} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs font-medium text-muted-foreground">{entry.rate}%</span>
                <div
                  className="w-full rounded-t-md bg-primary/15"
                  style={{ height: `${entry.rate * 1.4}px` }}
                />
                <span className="text-xs text-muted-foreground">{entry.month}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2">
            <Receipt className="size-4 text-primary" />
            Recent transactions
          </CardTitle>
          <CardDescription>Latest fee invoices and payments.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">Invoice</th>
                  <th className="py-2 pr-3 font-medium">Student</th>
                  <th className="py-2 pr-3 font-medium">Item</th>
                  <th className="py-2 pr-3 font-medium">Amount</th>
                  <th className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {TRANSACTIONS.map((tx) => (
                  <tr key={tx.id} className="border-b last:border-0">
                    <td className="py-2 pr-3 font-mono text-xs text-muted-foreground">{tx.id}</td>
                    <td className="py-2 pr-3 font-medium text-foreground">{tx.student}</td>
                    <td className="py-2 pr-3 text-muted-foreground">{tx.item}</td>
                    <td className="py-2 pr-3 font-medium text-foreground">{tx.amount}</td>
                    <td className="py-2">
                      <Badge
                        variant={
                          tx.status === 'Paid'
                            ? 'default'
                            : tx.status === 'Pending'
                              ? 'secondary'
                              : 'outline'
                        }
                        className={
                          tx.status === 'Partial' ? 'bg-warning/10 text-warning' : undefined
                        }
                      >
                        {tx.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
