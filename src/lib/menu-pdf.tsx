import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from '@react-pdf/renderer';
import type { MenuCategoryView } from '@/lib/menu';

const COLORS = {
  primary: '#D9882F',
  charcoal: '#2B2724',
  brown: '#6B5E54',
  light: '#FBF6EF',
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 44,
    fontSize: 10,
    color: COLORS.charcoal,
    fontFamily: 'Helvetica',
  },
  title: { fontSize: 28, fontFamily: 'Helvetica-Bold', color: COLORS.primary },
  subtitle: { fontSize: 11, color: COLORS.brown, marginTop: 2, marginBottom: 2 },
  rule: { borderBottomWidth: 2, borderBottomColor: COLORS.primary, marginTop: 10, marginBottom: 16 },
  category: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.charcoal,
    marginTop: 14,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#E6DED3',
  },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  itemName: { fontSize: 11, fontFamily: 'Helvetica-Bold', flex: 1, paddingRight: 8 },
  itemPrice: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: COLORS.primary },
  itemDesc: { fontSize: 8.5, color: COLORS.brown, marginTop: 1, lineHeight: 1.3 },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 44,
    right: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: COLORS.brown,
    borderTopWidth: 1,
    borderTopColor: '#E6DED3',
    paddingTop: 6,
  },
});

function MenuDocument({ categories, date }: { categories: MenuCategoryView[]; date: string }) {
  return (
    <Document title="Sweet Life Menu — Newry" author="Sweet Life">
      <Page size="A4" style={styles.page} wrap>
        <View>
          <Text style={styles.title}>Sweet Life</Text>
          <Text style={styles.subtitle}>12 Monaghan St, Newry BT35 6AA</Text>
          <View style={styles.rule} />
        </View>

        {categories.map((cat) => (
          <View key={cat.id} wrap={false}>
            <Text style={styles.category}>{cat.name}</Text>
            {cat.items.map((item) => (
              <View key={item.id}>
                <View style={styles.itemRow}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>
                    {item.price > 0 ? `£${item.price.toFixed(2)}` : ''}
                  </Text>
                </View>
                {item.description ? (
                  <Text style={styles.itemDesc}>{item.description}</Text>
                ) : null}
              </View>
            ))}
          </View>
        ))}

        <View style={styles.footer} fixed>
          <Text>sweetlife.cafe</Text>
          <Text>Updated {date}</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function renderMenuPdf(categories: MenuCategoryView[]): Promise<Buffer> {
  const date = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return renderToBuffer(<MenuDocument categories={categories} date={date} />);
}
