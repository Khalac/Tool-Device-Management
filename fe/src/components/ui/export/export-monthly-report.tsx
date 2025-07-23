import { useState } from 'react'
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui'
import { Download, FileText, FileSpreadsheet, Globe } from 'lucide-react'
import type { MonthlyStats, DateFilter } from '@/features/dashboard/model/statistics-types'
import type { AssetsType } from '@/features/assets/view-all-assets/model'
import { getDateRangeText, formatCurrency, formatNumber } from '@/features/dashboard/utils'

interface ExportMonthlyReportProps {
  data: MonthlyStats
  assets: AssetsType[]
  dateFilter: DateFilter
  onExport: (format: 'pdf' | 'csv' | 'html') => void
  className?: string
}

export const ExportMonthlyReport = ({ data, assets, dateFilter, onExport }: ExportMonthlyReportProps) => {
  const [isExporting, setIsExporting] = useState(false)

  const formatDateForExport = (dateString: string | Date | null | undefined): string => {
    if (!dateString) return '-'

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return '-'

      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()

      return `${day}/${month}/${year}`
    } catch {
      return '-'
    }
  }

  const formatCurrencyForCSV = (amount: number | null | undefined): string => {
    if (!amount && amount !== 0) return '0'

    return amount.toFixed(2)
  }

  const formatDateForCSV = (dateString: string | Date | null | undefined): string => {
    const formatted = formatDateForExport(dateString)
    return `"${formatted}"`
  }

  const generateCSVReport = () => {
    try {
      const timestamp = new Date().toISOString().split('T')[0]

      const summaryRows = [
        ['Monthly Asset Report'],
        ['Generated on:', new Date().toLocaleDateString()],
        ['Report Period:', getDateRangeText(dateFilter)],
        [''],
        ['SUMMARY STATISTICS'],
        ['Total Assets:', data.totalAssets.toString()],
        ['Total Value:', formatCurrencyForCSV(data.totalValue)],
        ['New Assets:', data.newAssetsCount.toString()],
        ['In Use:', data.inUseCount.toString()],
        ['Under Maintenance:', data.maintenanceCount.toString()],
        ['Retired/Disposed:', data.retiredAssetsCount.toString()],
        [''],
        ['CATEGORY BREAKDOWN'],
        ['Category', 'Count', 'Total Value', 'Percentage'],
      ]

      const categoryRows = data.categoryBreakdown.map((cat) => [
        `"${cat.categoryName}"`,
        cat.count.toString(),
        formatCurrencyForCSV(cat.totalValue),
        `${cat.percentage.toFixed(1)}%`,
      ])

      const statusHeader = [[''], ['STATUS DISTRIBUTION'], ['Status', 'Count', 'Total Value', 'Percentage']]
      const statusRows = data.statusDistribution.map((status) => [
        `"${status.status}"`,
        status.count.toString(),
        formatCurrencyForCSV(status.totalValue),
        `${status.percentage.toFixed(1)}%`,
      ])

      const assetHeader = [
        [''],
        ['ASSET DETAILS'],
        [
          'ID',
          'Name',
          'Category',
          'Department',
          'Status',
          'Cost',
          'Serial Number',
          'Location',
          'Purchase Date',
          'Warranty Expiry',
        ],
      ]

      const assetRows = assets.map((asset) => [
        asset.id.toString(),
        `"${asset.assetName}"`,
        `"${asset.category?.categoryName || 'N/A'}"`,
        `"${asset.department?.departmentName || 'N/A'}"`,
        `"${asset.status}"`,
        formatCurrencyForCSV(asset.cost),
        `"${asset.serialNumber}"`,
        `"${asset.department?.location?.locationAddress || 'N/A'}"`,
        formatDateForCSV(asset.purchaseDate),
        formatDateForCSV(asset.warrantExpiry),
      ])

      const departmentHeader = [
        [''],
        ['DEPARTMENT BREAKDOWN'],
        ['Department'.padEnd(20), 'Count'.padStart(8), 'Total Value'.padStart(15), 'Percentage'.padStart(12)],
      ]

      const departmentRows = data.departmentBreakdown.map((dep) => [
        `"${dep.departmentName}"`.padEnd(22),
        dep.count.toString().padStart(8),
        formatCurrencyForCSV(dep.totalValue).padStart(15),
        `${dep.percentage.toFixed(1)}%`.padStart(12),
      ])

      const allRows = [
        ...summaryRows,
        ...categoryRows,
        ...departmentHeader,
        ...departmentRows,
        ...statusHeader,
        ...statusRows,
        ...assetHeader,
        ...assetRows,
      ]

      const csvContent = allRows.map((row) => row.join(',')).join('\n')

      const BOM = '\uFEFF'
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `monthly-report-${timestamp}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('❌ CSV Export Error:', error)
      alert('Error generating CSV. Please try again.')
    }
  }

  const generateHTMLReport = () => {
    try {
      const reportTitle = `Monthly Report - ${getDateRangeText(dateFilter)}`
      const timestamp = new Date().toISOString().split('T')[0]

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${reportTitle}</title>
            <meta charset="UTF-8">
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                color: #333;
              }
              .header { 
                text-align: center; 
                margin-bottom: 30px; 
                border-bottom: 2px solid #e5e7eb;
                padding-bottom: 20px;
              }
              .summary-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin: 20px 0;
              }
              .summary-card {
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 16px;
                background: #f9fafb;
              }
              .summary-title {
                font-size: 14px;
                color: #6b7280;
                margin-bottom: 8px;
              }
              .summary-value {
                font-size: 24px;
                font-weight: bold;
                color: #111827;
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 20px 0;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              }
              th, td { 
                padding: 12px; 
                text-align: left; 
                border-bottom: 1px solid #e5e7eb;
              }
              th { 
                background-color: #f3f4f6; 
                font-weight: 600;
                color: #374151;
              }
              tr:nth-child(even) {
                background-color: #f9fafb;
              }
              .section-title {
                font-size: 20px;
                font-weight: bold;
                margin: 30px 0 15px 0;
                color: #111827;
                border-left: 4px solid #3b82f6;
                padding-left: 12px;
              }
              .currency { 
                font-weight: bold; 
                color: #059669; 
              }
              .status { 
                padding: 4px 8px; 
                border-radius: 4px; 
                font-size: 12px; 
                font-weight: 500; 
              }
              
              .status-new { 
                background-color: #dcfce7; 
                color: #166534; 
                border: 1px solid #bbf7d0; 
              }
              .status-in-use { 
                background-color: #dbeafe; 
                color: #1e40af; 
                border: 1px solid #bfdbfe; 
              }
              .status-under-maintenance { 
                background-color: #fef3c7; 
                color: #92400e; 
                border: 1px solid #fde68a; 
              }
              .status-retired { 
                background-color: #f1f5f9; 
                color: #475569; 
                border: 1px solid #e2e8f0; 
              }
              .status-disposed { 
                background-color: #fee2e2; 
                color: #dc2626; 
                border: 1px solid #fecaca; 
              }
              
              .meta-info {
                background: #f3f4f6;
                padding: 15px;
                border-radius: 8px;
                margin-top: 30px;
                font-size: 14px;
                color: #6b7280;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${reportTitle}</h1>
              <p>Generated on ${new Date().toLocaleDateString()}</p>
            </div>

            <div class="section-title">Summary Statistics</div>
            <div class="summary-grid">
              <div class="summary-card">
                <div class="summary-title">Total Assets</div>
                <div class="summary-value">${formatNumber(data.totalAssets)}</div>
              </div>
              <div class="summary-card">
                <div class="summary-title">Total Value</div>
                <div class="summary-value">${formatCurrency(data.totalValue)}</div>
              </div>
              <div class="summary-card">
                <div class="summary-title">New Assets</div>
                <div class="summary-value">${formatNumber(data.newAssetsCount)}</div>
              </div>
              <div class="summary-card">
                <div class="summary-title">In Use</div>
                <div class="summary-value">${formatNumber(data.inUseCount)}</div>
              </div>
              <div class="summary-card">
                <div class="summary-title">Under Maintenance</div>
                <div class="summary-value">${formatNumber(data.maintenanceCount)}</div>
              </div>
              <div class="summary-card">
                <div class="summary-title">Retired/Disposed</div>
                <div class="summary-value">${formatNumber(data.retiredAssetsCount)}</div>
              </div>
            </div>

            <div class="section-title">Category Breakdown</div>
            <table>
              <thead>
              
                 <tr>
      <th style="width: 30%;">Category</th>
      <th style="width: 15%;">Count</th>
      <th style="width: 25%;">Total Value</th>
      <th style="width: 15%;">Percentage</th>
    </tr>
            
              </thead>
              <tbody>
                ${data.categoryBreakdown
                  .map(
                    (cat) => `
                  <tr>
                    <td>${cat.categoryName}</td>
                    <td>${formatNumber(cat.count)}</td>
                    <td class="currency">${formatCurrency(cat.totalValue)}</td>
                    <td>${cat.percentage.toFixed(1)}%</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
                  <div class="section-title">Department Breakdown</div>
<table class="breakdown-table">
  <thead>
   
      <tr>
      <th style="width: 30%;">Department</th>
      <th style="width: 15%;">Count</th>
      <th style="width: 25%;">Total Value</th>
      <th style="width: 15%;">Percentage</th>
   
    </tr>
  </thead>
  <tbody>
    ${data.departmentBreakdown
      .map(
        (dep) => `
      <tr>
        <td>${dep.departmentName}</td>
        <td>${formatNumber(dep.count)}</td>
        <td class="currency">${formatCurrency(dep.totalValue)}</td>
        <td>${dep.percentage.toFixed(1)}%</td>
      </tr>
    `
      )
      .join('')}
  </tbody>
</table>
            <div class="section-title">Status Distribution</div>
            <table>
              <thead>
           
                 <tr>
      <th style="width: 30%;">Status</th>
      <th style="width: 15%;">Count</th>
      <th style="width: 25%;">Total Value</th>
      <th style="width: 15%;">Percentage</th>
    </tr>
             
              </thead>
              <tbody>
                ${data.statusDistribution
                  .map(
                    (status) => `
                  <tr>
                    <td>
                      <span class="status status-${status.status.toLowerCase().replace(/\s+/g, '-')}">${status.status}</span>
                    </td>
                    <td>${formatNumber(status.count)}</td>
                    <td class="currency">${formatCurrency(status.totalValue)}</td>
                    <td>${status.percentage.toFixed(1)}%</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>

            <div class="section-title">Asset Details</div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Asset Name</th>
                  <th>Category</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Cost</th>
                  <th>Serial Number</th>
                  <th>Location</th>
                  <th>Purchase Date</th>
                  <th>Warranty Expiry</th>
                </tr>
              </thead>
              <tbody>
                ${assets
                  .map(
                    (asset) => `
                  <tr>
                    <td>${asset.id}</td>
                    <td>${asset.assetName}</td>
                    <td>${asset.category?.categoryName || 'N/A'}</td>
                    <td>${asset.department?.departmentName || 'N/A'}</td>
                    <td>
                      <span class="status status-${asset.status.toLowerCase().replace(/\s+/g, '-')}">${asset.status}</span>
                    </td>
                    <td class="currency">${formatCurrency(asset.cost || 0)}</td>
                    <td>${asset.serialNumber}</td>
                    <td>${asset.department?.location?.locationAddress || 'N/A'}</td>
                    <td>${formatDateForExport(asset.purchaseDate)}</td>
                    <td>${formatDateForExport(asset.warrantExpiry)}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>

            <div class="meta-info">
              <p><strong>Report Period:</strong> ${getDateRangeText(dateFilter)}</p>
              <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>Total Records:</strong> ${assets.length} assets</p>
            </div>
          </body>
        </html>
      `

      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `monthly-report-${timestamp}.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('❌ HTML Export Error:', error)
      alert('Error generating HTML. Please try again.')
    }
  }

  const generatePDFReport = async () => {
    try {
      let jsPDF, autoTable

      try {
        const [jsPDFModule, autoTableModule] = await Promise.all([import('jspdf'), import('jspdf-autotable')])
        jsPDF = jsPDFModule.default
        autoTable = autoTableModule.default
      } catch (importError) {
        console.error('❌ Failed to import PDF libraries:', importError)
        alert('Failed to load PDF libraries. Please refresh and try again.')
        return
      }

      const doc = new jsPDF('p', 'mm', 'a4')
      const timestamp = new Date().toISOString().split('T')[0]

      doc.setFontSize(20)
      doc.text(`Monthly Report - ${getDateRangeText(dateFilter)}`, 20, 20)

      doc.setFontSize(12)
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30)
      doc.text(`Report Period: ${getDateRangeText(dateFilter)}`, 20, 40)

      const summaryData = [
        ['Total Assets', formatNumber(data.totalAssets)],
        ['Total Value', formatCurrency(data.totalValue)],
        ['New Assets', formatNumber(data.newAssetsCount)],
        ['In Use', formatNumber(data.inUseCount)],
        ['Under Maintenance', formatNumber(data.maintenanceCount)],
        ['Retired/Disposed', formatNumber(data.retiredAssetsCount)],
      ]

      autoTable(doc, {
        head: [['Metric', 'Value']],
        body: summaryData,
        startY: 50,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
      })

      const departmentData = data.departmentBreakdown.map((cat) => [
        cat.departmentName,
        formatNumber(cat.count),
        formatCurrency(cat.totalValue),
        `${cat.percentage.toFixed(1)}%`,
      ])

      let lastY = (doc as any).lastAutoTable?.finalY || 120

      autoTable(doc, {
        head: [['Department', 'Count', 'Total Value', 'Percentage']],
        body: departmentData,
        startY: lastY + 15,
        theme: 'grid',
        headStyles: { fillColor: [34, 197, 94] },
        columnStyles: {
          0: { cellWidth: 42 },
          1: { cellWidth: 42 },
          2: { cellWidth: 50 },
          3: { cellWidth: 50 },
        },
      })
      const categoryData = data.categoryBreakdown.map((cat) => [
        cat.categoryName,
        formatNumber(cat.count),
        formatCurrency(cat.totalValue),
        `${cat.percentage.toFixed(1)}%`,
      ])
      lastY = (doc as any).lastAutoTable?.finalY || 180

      autoTable(doc, {
        head: [['Category', 'Count', 'Total Value', 'Percentage']],
        body: categoryData,
        startY: lastY + 15,
        theme: 'grid',
        headStyles: { fillColor: [34, 197, 94] },
        columnStyles: {
          0: { cellWidth: 42 },
          1: { cellWidth: 42 },
          2: { cellWidth: 50 },
          3: { cellWidth: 50 },
        },
      })

      const statusData = data.statusDistribution.map((status) => [
        status.status,
        formatNumber(status.count),
        formatCurrency(status.totalValue),
        `${status.percentage.toFixed(1)}%`,
      ])

      lastY = (doc as any).lastAutoTable?.finalY || 180

      autoTable(doc, {
        head: [['Status', 'Count', 'Total Value', 'Percentage']],
        body: statusData,
        startY: lastY + 15,
        theme: 'grid',
        headStyles: { fillColor: [168, 85, 247] },
        columnStyles: {
          0: { cellWidth: 42 },
          1: { cellWidth: 42 },
          2: { cellWidth: 50 },
          3: { cellWidth: 50 },
        },
      })

      const assetData = assets.map((asset) => [
        asset.id.toString(),
        asset.assetName,
        asset.category?.categoryName || 'N/A',
        asset.department?.departmentName || 'N/A',
        asset.status,
        formatCurrency(asset.cost || 0),
        asset.serialNumber,
        asset.department?.location?.locationAddress || 'N/A',
        formatDateForExport(asset.purchaseDate),
        formatDateForExport(asset.warrantExpiry),
      ])

      lastY = (doc as any).lastAutoTable?.finalY || 240

      autoTable(doc, {
        head: [
          ['ID', 'Name', 'Category', 'Department', 'Status', 'Cost', 'Serial', 'Location', 'Purchase', 'Warranty'],
        ],
        body: assetData,
        startY: lastY + 15,
        theme: 'grid',
        headStyles: { fillColor: [239, 68, 68] },
        styles: {
          fontSize: 8,
          cellPadding: 2,
          overflow: 'linebreak',
          halign: 'left',
          valign: 'middle',
        },
        columnStyles: {
          0: { cellWidth: 7 },
          1: { cellWidth: 25 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 18 },
          5: { cellWidth: 13 },
          6: { cellWidth: 13 },
          7: { cellWidth: 30 },
          8: { cellWidth: 18 },
          9: { cellWidth: 18 },
        },

        didDrawPage: function (data) {
          doc.setFontSize(10)
          doc.text(`Page ${data.pageNumber}`, 180, 280)
        },
        margin: { top: 20, right: 14, bottom: 30, left: 14 },
        pageBreak: 'avoid',
        rowPageBreak: 'avoid',
      })

      doc.save(`monthly-report-${timestamp}.pdf`)
    } catch (error) {
      console.error('❌ PDF Export Error:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  const handleExport = async (format: 'pdf' | 'csv' | 'html') => {
    setIsExporting(true)
    try {
      switch (format) {
        case 'csv':
          generateCSVReport()
          break
        case 'html':
          generateHTMLReport()
          break
        case 'pdf':
          await generatePDFReport()
          break
      }
      onExport(format)
    } catch (error) {
      console.error(`❌ Export ${format.toUpperCase()} failed:`, error)
      alert(`Error exporting ${format.toUpperCase()}. Please try again.`)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          disabled={isExporting}
          className='text-primary border-primary hover:bg-primary/10 hover:text-primary h-9'
        >
          <Download className='text-primary mr-2 h-4 w-4' />
          {isExporting ? 'Exporting...' : 'Export Report'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileSpreadsheet className='mr-2 h-4 w-4' />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <FileText className='mr-2 h-4 w-4' />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('html')}>
          <Globe className='mr-2 h-4 w-4' />
          Export as HTML
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
